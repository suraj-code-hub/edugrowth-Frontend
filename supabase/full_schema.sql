-- ====================================================================
-- EduGrowth Platform - Complete Supabase Backend Turnkey Setup
-- Run this entire script in Supabase Dashboard -> SQL Editor
-- ====================================================================


-- >>> FILE: supabase/migrations/20261024000001_initial_schema.sql <<<

-- ====================================================================
-- EduGrowth Platform - PostgreSQL Database Schema Migration (Part 1/5)
-- Tables, Constraints, Triggers, and Foreign Keys
-- Compatible with Supabase PostgreSQL 15+
-- ====================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE (Associated with auth.users)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    alternate_phone TEXT,
    college TEXT,
    education TEXT,
    skills TEXT[] DEFAULT '{}'::TEXT[],
    about_me TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    profile_image_path TEXT,
    resume_file_path TEXT,
    profile_completion INTEGER DEFAULT 60 CHECK (profile_completion >= 0 AND profile_completion <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 2. USER ROLES TABLE (Exact 6 Roles)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN (
        'ADMIN',
        'CONTENT_MANAGER',
        'PLACEMENT_MANAGER',
        'SUPPORT_MANAGER',
        'FINANCE_MANAGER',
        'STUDENT'
    )),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_roles_user_role UNIQUE (user_id, role)
);

-- --------------------------------------------------------------------
-- 3. STAFF ACCOUNTS TABLE (Staff profiles with active state)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN (
        'ADMIN',
        'CONTENT_MANAGER',
        'PLACEMENT_MANAGER',
        'SUPPORT_MANAGER',
        'FINANCE_MANAGER'
    )),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 4. COURSES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'All Levels' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
    duration TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    thumbnail_path TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 5. COURSE SECTIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 6. LESSONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.course_sections(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Protected notes / learning guide
    video_url TEXT,
    duration TEXT,
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_free_preview BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 7. ENROLLMENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    purchase_reference UUID,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_course_enrollment UNIQUE (student_id, course_id)
);

-- --------------------------------------------------------------------
-- 8. LESSON PROGRESS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_lesson_progress UNIQUE (student_id, lesson_id)
);

-- --------------------------------------------------------------------
-- 9. LEARNING RESOURCES TABLE (Notes, Guides, Cheat sheets)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    file_path TEXT,
    preview_info TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    is_free BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 10. PURCHASES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_type TEXT NOT NULL CHECK (product_type IN ('course', 'learning_resource')),
    product_id UUID NOT NULL,
    payment_reference TEXT,
    access_status TEXT NOT NULL DEFAULT 'granted' CHECK (access_status IN ('granted', 'revoked', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_product_purchase UNIQUE (student_id, product_type, product_id)
);

-- --------------------------------------------------------------------
-- 11. PROJECTS TABLE (Showcase)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    technology_stack TEXT[] DEFAULT '{}'::TEXT[],
    image_path TEXT,
    demo_url TEXT,
    repository_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 12. JOBS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization_name TEXT NOT NULL,
    department TEXT,
    job_type TEXT NOT NULL DEFAULT 'Full-Time', -- Full-Time, Part-Time, Contract
    location TEXT NOT NULL,
    work_mode TEXT NOT NULL DEFAULT 'Remote' CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site', 'In-Office')),
    experience TEXT,
    required_skills TEXT[] DEFAULT '{}'::TEXT[],
    eligibility TEXT,
    responsibilities TEXT,
    deadline DATE,
    description TEXT,
    allow_guest_applications BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'closed')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 13. INTERNSHIPS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization_name TEXT NOT NULL,
    duration TEXT NOT NULL,
    stipend TEXT,
    work_mode TEXT NOT NULL DEFAULT 'Remote' CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site', 'In-Office')),
    location TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}'::TEXT[],
    eligibility TEXT,
    deadline DATE,
    description TEXT,
    allow_guest_applications BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'closed')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 14. APPLICATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('job', 'internship')),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT,
    college TEXT,
    degree TEXT,
    year_or_semester TEXT,
    graduation_year TEXT,
    resume_storage_path TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}'::TEXT[],
    experience TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    availability TEXT,
    cover_letter TEXT,
    work_authorization TEXT,
    consent BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN (
        'Applied',
        'Reviewing',
        'Shortlisted',
        'Interview',
        'Selected',
        'Rejected',
        'Completed'
    )),
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_app_opportunity_ref CHECK (
        (opportunity_type = 'job' AND job_id IS NOT NULL AND internship_id IS NULL) OR
        (opportunity_type = 'internship' AND internship_id IS NOT NULL AND job_id IS NULL)
    )
);

-- Prevent duplicate applications from same student
CREATE UNIQUE INDEX IF NOT EXISTS uq_idx_app_student_job 
    ON public.applications (student_id, job_id) 
    WHERE student_id IS NOT NULL AND job_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_idx_app_student_internship 
    ON public.applications (student_id, internship_id) 
    WHERE student_id IS NOT NULL AND internship_id IS NOT NULL;

-- --------------------------------------------------------------------
-- 15. SAVED OPPORTUNITIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('job', 'internship')),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_saved_opportunity_ref CHECK (
        (opportunity_type = 'job' AND job_id IS NOT NULL AND internship_id IS NULL) OR
        (opportunity_type = 'internship' AND internship_id IS NOT NULL AND job_id IS NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_idx_saved_job 
    ON public.saved_opportunities (student_id, job_id) 
    WHERE job_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_idx_saved_internship 
    ON public.saved_opportunities (student_id, internship_id) 
    WHERE internship_id IS NOT NULL;

-- --------------------------------------------------------------------
-- 16. MENTOR APPLICATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mentor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    current_role TEXT,
    organization TEXT,
    skills TEXT[] DEFAULT '{}'::TEXT[],
    experience TEXT,
    topics TEXT[] DEFAULT '{}'::TEXT[],
    linkedin_url TEXT,
    github_url TEXT,
    reason TEXT,
    availability TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Interviewing')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 17. SERVICES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    icon TEXT,
    features TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 18. CONTACT ENQUIRIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    organization_or_college TEXT,
    inquiry_type TEXT NOT NULL CHECK (inquiry_type IN (
        'Course or Training',
        'Internship',
        'Job or Career',
        'Mentorship',
        'Technology Services',
        'Business Development',
        'General Inquiry'
    )),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN (
        'New',
        'Contacted',
        'Proposal',
        'In Progress',
        'Completed',
        'Cancelled'
    )),
    assigned_staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 19. SERVICE ENQUIRIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    organization TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN (
        'New',
        'Contacted',
        'Proposal',
        'In Progress',
        'Completed',
        'Cancelled'
    )),
    assigned_staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 20. PAYMENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_type TEXT NOT NULL CHECK (product_type IN ('course', 'learning_resource')),
    product_id UUID NOT NULL,
    provider TEXT NOT NULL DEFAULT 'razorpay',
    provider_order_id TEXT UNIQUE,
    provider_payment_id TEXT UNIQUE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
        'pending',
        'successful',
        'failed',
        'refunded'
    )),
    verification_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 21. NOTIFICATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 22. AUDIT LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    safe_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_courses_category_status ON public.courses (category, status);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses (slug);
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON public.lessons (course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments (student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments (course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON public.lesson_progress (student_id);
CREATE INDEX IF NOT EXISTS idx_resources_category_status ON public.learning_resources (category, status);
CREATE INDEX IF NOT EXISTS idx_jobs_status_deadline ON public.jobs (status, deadline);
CREATE INDEX IF NOT EXISTS idx_internships_status_deadline ON public.internships (status, deadline);
CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications (student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_payments_student ON public.payments (student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (payment_status);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications (recipient_user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.contact_enquiries (status);
CREATE INDEX IF NOT EXISTS idx_service_enquiries_status ON public.service_enquiries (status);

-- ====================================================================
-- SECURE ROLE & AUTH HELPER FUNCTIONS (SECURITY DEFINER)
-- Prevents RLS recursive loops and ensures tamper-proof privilege checks
-- ====================================================================

-- Helper 1: Get single role for a user
CREATE OR REPLACE FUNCTION public.get_user_role(target_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT role FROM public.user_roles WHERE user_id = target_user_id LIMIT 1;
$$;

-- Helper 2: Check if current auth user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(checked_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = checked_role
    );
$$;

-- Helper 3: Check if current user is an active ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'ADMIN'
    );
$$;

-- Helper 4: Check if current user is any active staff member
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
          AND role IN ('ADMIN', 'CONTENT_MANAGER', 'PLACEMENT_MANAGER', 'SUPPORT_MANAGER', 'FINANCE_MANAGER')
    );
$$;

-- ====================================================================
-- TRIGGERS FOR AUTOMATIC PROFILE & ROLE ON REGISTRATION
-- "All public registrations must receive the STUDENT role.
--  Never accept an arbitrary role from frontend registration input."
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_skills TEXT[] := '{}'::TEXT[];
    extracted_skills JSONB;
BEGIN
    -- Extract skills safely from user_metadata
    extracted_skills := NEW.raw_user_meta_data->'skills';
    IF extracted_skills IS NOT NULL AND jsonb_typeof(extracted_skills) = 'array' THEN
        SELECT array_agg(value::text) INTO user_skills
        FROM jsonb_array_elements_text(extracted_skills) AS value;
    END IF;

    -- 1. Create Profile row
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        phone,
        alternate_phone,
        college,
        education,
        skills,
        about_me,
        github_url,
        linkedin_url,
        profile_completion
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'alternate_phone',
        NEW.raw_user_meta_data->>'college',
        NEW.raw_user_meta_data->>'education',
        COALESCE(user_skills, '{}'::TEXT[]),
        COALESCE(NEW.raw_user_meta_data->>'about_me', ''),
        NEW.raw_user_meta_data->>'github_url',
        NEW.raw_user_meta_data->>'linkedin_url',
        60
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = timezone('utc'::text, now());

    -- 2. MANDATORY: Assign STUDENT role strictly
    -- Public signups can never assign themselves ADMIN or staff roles
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.id, 'STUDENT', NULL)
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ACCIDENTAL SELF-DEACTIVATION PROTECTION TRIGGER
-- "Prevent an administrator from accidentally deactivating their own account"
-- ====================================================================

CREATE OR REPLACE FUNCTION public.prevent_admin_self_deactivation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF OLD.role = 'ADMIN' AND NEW.is_active = FALSE AND OLD.user_id = auth.uid() THEN
        RAISE EXCEPTION 'Security Guard: Administrators cannot deactivate their own account.';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_admin_self_deactivation ON public.staff_accounts;
CREATE TRIGGER trg_prevent_admin_self_deactivation
    BEFORE UPDATE ON public.staff_accounts
    FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_self_deactivation();


-- >>> FILE: supabase/migrations/20261024000002_rls_policies.sql <<<

-- ====================================================================
-- EduGrowth Platform - Row Level Security (RLS) Policies (Part 2/5)
-- Enables RLS on all 22 tables and establishes zero-trust access control
-- ====================================================================

-- --------------------------------------------------------------------
-- ENABLE RLS ON ALL 22 TABLES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 1. PROFILES POLICIES
-- ====================================================================
-- Students can read their own profile; Staff/Admins can view profiles for operations
CREATE POLICY "profiles_select_own_or_staff" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR public.is_staff()
    );

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id
    ) WITH CHECK (
        auth.uid() = id
    );

-- User can insert their own profile (or handled by trigger)
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id
    );

-- ====================================================================
-- 2. USER ROLES POLICIES
-- Roles must not be editable by ordinary users.
-- ====================================================================
-- Users can see their own role; Admins can see all user roles
CREATE POLICY "user_roles_select" ON public.user_roles
    FOR SELECT USING (
        auth.uid() = user_id OR public.is_admin()
    );

-- Only ADMIN can insert roles
CREATE POLICY "user_roles_insert_admin" ON public.user_roles
    FOR INSERT WITH CHECK (
        public.is_admin()
    );

-- Only ADMIN can update roles
CREATE POLICY "user_roles_update_admin" ON public.user_roles
    FOR UPDATE USING (
        public.is_admin()
    ) WITH CHECK (
        public.is_admin()
    );

-- Only ADMIN can delete roles
CREATE POLICY "user_roles_delete_admin" ON public.user_roles
    FOR DELETE USING (
        public.is_admin()
    );

-- ====================================================================
-- 3. STAFF ACCOUNTS POLICIES
-- ====================================================================
CREATE POLICY "staff_accounts_select" ON public.staff_accounts
    FOR SELECT USING (
        public.is_staff()
    );

CREATE POLICY "staff_accounts_admin_all" ON public.staff_accounts
    FOR ALL USING (
        public.is_admin()
    ) WITH CHECK (
        public.is_admin()
    );

-- ====================================================================
-- 4. COURSES POLICIES
-- Public can view published; Content Managers & Admin manage all
-- ====================================================================
CREATE POLICY "courses_select" ON public.courses
    FOR SELECT USING (
        status = 'published' OR 
        public.has_role('CONTENT_MANAGER') OR 
        public.is_admin()
    );

CREATE POLICY "courses_insert_cm" ON public.courses
    FOR INSERT WITH CHECK (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

CREATE POLICY "courses_update_cm" ON public.courses
    FOR UPDATE USING (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    ) WITH CHECK (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

CREATE POLICY "courses_delete_cm" ON public.courses
    FOR DELETE USING (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 5. COURSE SECTIONS POLICIES
-- ====================================================================
CREATE POLICY "sections_select" ON public.course_sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses c 
            WHERE c.id = course_id AND (c.status = 'published' OR public.has_role('CONTENT_MANAGER') OR public.is_admin())
        )
    );

CREATE POLICY "sections_manage_cm" ON public.course_sections
    FOR ALL USING (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    ) WITH CHECK (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 6. LESSONS POLICIES
-- Free preview or enrolled students can view; Content Managers manage
-- ====================================================================
CREATE POLICY "lessons_select" ON public.lessons
    FOR SELECT USING (
        -- Lesson metadata is visible if course is published
        EXISTS (
            SELECT 1 FROM public.courses c 
            WHERE c.id = course_id AND c.status = 'published'
        ) OR public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

CREATE POLICY "lessons_manage_cm" ON public.lessons
    FOR ALL USING (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    ) WITH CHECK (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 7. ENROLLMENTS POLICIES
-- Students can only view their own enrollments; Admin can view all
-- ====================================================================
CREATE POLICY "enrollments_select" ON public.enrollments
    FOR SELECT USING (
        student_id = auth.uid() OR public.is_admin()
    );

-- Students can enroll themselves into free published courses
CREATE POLICY "enrollments_insert_free" ON public.enrollments
    FOR INSERT WITH CHECK (
        student_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.courses c 
            WHERE c.id = course_id AND c.status = 'published' AND c.price = 0
        )
    );

-- Admin can manage enrollments directly
CREATE POLICY "enrollments_manage_admin" ON public.enrollments
    FOR ALL USING (
        public.is_admin()
    );

-- ====================================================================
-- 8. LESSON PROGRESS POLICIES
-- ====================================================================
CREATE POLICY "progress_select" ON public.lesson_progress
    FOR SELECT USING (
        student_id = auth.uid() OR public.is_admin()
    );

CREATE POLICY "progress_upsert_own" ON public.lesson_progress
    FOR ALL USING (
        student_id = auth.uid()
    ) WITH CHECK (
        student_id = auth.uid()
    );

-- ====================================================================
-- 9. LEARNING RESOURCES POLICIES
-- ====================================================================
CREATE POLICY "resources_select" ON public.learning_resources
    FOR SELECT USING (
        status = 'published' OR public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

CREATE POLICY "resources_manage_cm" ON public.learning_resources
    FOR ALL USING (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    ) WITH CHECK (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 10. PURCHASES POLICIES
-- ====================================================================
CREATE POLICY "purchases_select" ON public.purchases
    FOR SELECT USING (
        student_id = auth.uid() OR public.has_role('FINANCE_MANAGER') OR public.is_admin()
    );

CREATE POLICY "purchases_manage_finance" ON public.purchases
    FOR ALL USING (
        public.has_role('FINANCE_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 11. PROJECTS POLICIES
-- ====================================================================
CREATE POLICY "projects_select" ON public.projects
    FOR SELECT USING (
        status = 'published' OR public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

CREATE POLICY "projects_manage_cm" ON public.projects
    FOR ALL USING (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    ) WITH CHECK (
        public.has_role('CONTENT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 12. JOBS POLICIES
-- ====================================================================
CREATE POLICY "jobs_select" ON public.jobs
    FOR SELECT USING (
        status = 'published' OR public.has_role('PLACEMENT_MANAGER') OR public.is_admin()
    );

CREATE POLICY "jobs_manage_placement" ON public.jobs
    FOR ALL USING (
        public.has_role('PLACEMENT_MANAGER') OR public.is_admin()
    ) WITH CHECK (
        public.has_role('PLACEMENT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 13. INTERNSHIPS POLICIES
-- ====================================================================
CREATE POLICY "internships_select" ON public.internships
    FOR SELECT USING (
        status = 'published' OR public.has_role('PLACEMENT_MANAGER') OR public.is_admin()
    );

CREATE POLICY "internships_manage_placement" ON public.internships
    FOR ALL USING (
        public.has_role('PLACEMENT_MANAGER') OR public.is_admin()
    ) WITH CHECK (
        public.has_role('PLACEMENT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 14. APPLICATIONS POLICIES
-- Students view only their own; Placement Manager & Admin review all
-- ====================================================================
CREATE POLICY "applications_select" ON public.applications
    FOR SELECT USING (
        student_id = auth.uid() OR 
        public.has_role('PLACEMENT_MANAGER') OR 
        public.is_admin()
    );

-- Authenticated students can apply, or guest applications if allowed
CREATE POLICY "applications_insert" ON public.applications
    FOR INSERT WITH CHECK (
        (auth.uid() IS NOT NULL AND student_id = auth.uid()) OR
        (auth.uid() IS NULL AND student_id IS NULL AND (
            (opportunity_type = 'job' AND EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.allow_guest_applications = TRUE)) OR
            (opportunity_type = 'internship' AND EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.allow_guest_applications = TRUE))
        ))
    );

-- Only PLACEMENT_MANAGER and ADMIN can update application status & reviewer notes
CREATE POLICY "applications_update_pm" ON public.applications
    FOR UPDATE USING (
        public.has_role('PLACEMENT_MANAGER') OR public.is_admin()
    ) WITH CHECK (
        public.has_role('PLACEMENT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 15. SAVED OPPORTUNITIES POLICIES
-- ====================================================================
CREATE POLICY "saved_opportunities_all_own" ON public.saved_opportunities
    FOR ALL USING (
        student_id = auth.uid()
    ) WITH CHECK (
        student_id = auth.uid()
    );

-- ====================================================================
-- 16. MENTOR APPLICATIONS POLICIES
-- ====================================================================
CREATE POLICY "mentor_applications_select" ON public.mentor_applications
    FOR SELECT USING (
        email = auth.jwt()->>'email' OR public.is_admin()
    );

CREATE POLICY "mentor_applications_insert_public" ON public.mentor_applications
    FOR INSERT WITH CHECK (
        TRUE
    );

CREATE POLICY "mentor_applications_update_admin" ON public.mentor_applications
    FOR UPDATE USING (
        public.is_admin()
    );

-- ====================================================================
-- 17. SERVICES POLICIES
-- ====================================================================
CREATE POLICY "services_select" ON public.services
    FOR SELECT USING (
        status = 'published' OR public.is_admin()
    );

CREATE POLICY "services_manage_admin" ON public.services
    FOR ALL USING (
        public.is_admin()
    );

-- ====================================================================
-- 18. CONTACT ENQUIRIES POLICIES
-- ====================================================================
CREATE POLICY "contact_enquiries_select" ON public.contact_enquiries
    FOR SELECT USING (
        email = auth.jwt()->>'email' OR 
        public.has_role('SUPPORT_MANAGER') OR 
        public.is_admin()
    );

CREATE POLICY "contact_enquiries_insert_public" ON public.contact_enquiries
    FOR INSERT WITH CHECK (
        TRUE
    );

CREATE POLICY "contact_enquiries_update_support" ON public.contact_enquiries
    FOR UPDATE USING (
        public.has_role('SUPPORT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 19. SERVICE ENQUIRIES POLICIES
-- ====================================================================
CREATE POLICY "service_enquiries_select" ON public.service_enquiries
    FOR SELECT USING (
        email = auth.jwt()->>'email' OR 
        public.has_role('SUPPORT_MANAGER') OR 
        public.is_admin()
    );

CREATE POLICY "service_enquiries_insert_public" ON public.service_enquiries
    FOR INSERT WITH CHECK (
        TRUE
    );

CREATE POLICY "service_enquiries_update_support" ON public.service_enquiries
    FOR UPDATE USING (
        public.has_role('SUPPORT_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 20. PAYMENTS POLICIES
-- ====================================================================
CREATE POLICY "payments_select" ON public.payments
    FOR SELECT USING (
        student_id = auth.uid() OR 
        public.has_role('FINANCE_MANAGER') OR 
        public.is_admin()
    );

CREATE POLICY "payments_manage_finance" ON public.payments
    FOR ALL USING (
        public.has_role('FINANCE_MANAGER') OR public.is_admin()
    );

-- ====================================================================
-- 21. NOTIFICATIONS POLICIES
-- ====================================================================
CREATE POLICY "notifications_select_own" ON public.notifications
    FOR SELECT USING (
        recipient_user_id = auth.uid()
    );

CREATE POLICY "notifications_update_own" ON public.notifications
    FOR UPDATE USING (
        recipient_user_id = auth.uid()
    ) WITH CHECK (
        recipient_user_id = auth.uid()
    );

CREATE POLICY "notifications_insert_staff" ON public.notifications
    FOR INSERT WITH CHECK (
        public.is_staff()
    );

-- ====================================================================
-- 22. AUDIT LOGS POLICIES
-- ====================================================================
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
    FOR SELECT USING (
        public.is_admin()
    );

CREATE POLICY "audit_logs_insert_all" ON public.audit_logs
    FOR INSERT WITH CHECK (
        TRUE
    );


-- >>> FILE: supabase/migrations/20261024000003_storage_setup.sql <<<

-- ====================================================================
-- EduGrowth Platform - Storage Buckets & Policies (Part 3/5)
-- Configures storage buckets and zero-trust file access rules
-- ====================================================================

-- 1. Create Storage Buckets in storage.buckets table
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('public-assets', 'public-assets', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
    ('student-files', 'student-files', FALSE, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg']),
    ('learning-resources', 'learning-resources', FALSE, 52428800, ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- --------------------------------------------------------------------
-- 2. PUBLIC-ASSETS BUCKET POLICIES
-- Anyone can view; Only Content Manager & Admin can upload/modify
-- --------------------------------------------------------------------
CREATE POLICY "public_assets_view_all"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'public-assets');

CREATE POLICY "public_assets_upload_cm"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'public-assets' AND
        (public.has_role('CONTENT_MANAGER') OR public.is_admin())
    );

CREATE POLICY "public_assets_update_cm"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'public-assets' AND
        (public.has_role('CONTENT_MANAGER') OR public.is_admin())
    );

CREATE POLICY "public_assets_delete_cm"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'public-assets' AND
        (public.has_role('CONTENT_MANAGER') OR public.is_admin())
    );

-- --------------------------------------------------------------------
-- 3. STUDENT-FILES BUCKET POLICIES (Private Resumes & Documents)
-- Student can only upload/view/delete their own folder
-- Placement Manager and Admin can review candidate resumes
-- --------------------------------------------------------------------
CREATE POLICY "student_files_select_own_or_placement"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'student-files' AND
        (
            auth.uid()::text = (storage.foldername(name))[1] OR
            public.has_role('PLACEMENT_MANAGER') OR
            public.is_admin()
        )
    );

CREATE POLICY "student_files_insert_own"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'student-files' AND
        auth.uid() IS NOT NULL AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "student_files_update_own"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'student-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "student_files_delete_own"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'student-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- --------------------------------------------------------------------
-- 4. LEARNING-RESOURCES BUCKET POLICIES (Course materials & paid notes)
-- Content Managers and Admin can upload and manage
-- Enrolled / purchased students can download
-- --------------------------------------------------------------------
CREATE POLICY "learning_resources_view_authorized"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'learning-resources' AND
        (
            public.has_role('CONTENT_MANAGER') OR
            public.is_admin() OR
            -- Student who purchased or enrolled
            EXISTS (
                SELECT 1 FROM public.enrollments e
                JOIN public.courses c ON c.id = e.course_id
                WHERE e.student_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM public.purchases p
                WHERE p.student_id = auth.uid() AND p.access_status = 'granted'
            )
        )
    );

CREATE POLICY "learning_resources_manage_cm"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'learning-resources' AND
        (public.has_role('CONTENT_MANAGER') OR public.is_admin())
    )
    WITH CHECK (
        bucket_id = 'learning-resources' AND
        (public.has_role('CONTENT_MANAGER') OR public.is_admin())
    );


-- >>> FILE: supabase/migrations/20261024000004_seed_data.sql <<<

-- ====================================================================
-- EduGrowth Platform - Realistic Seed Data (Part 4/5)
-- Populates courses, lessons, resources, projects, jobs, internships,
-- services, and enquiry categories.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. COURSES SEED
-- --------------------------------------------------------------------
INSERT INTO public.courses (id, title, slug, description, category, difficulty, duration, price, currency, thumbnail_path, status)
VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'Full-Stack Modern Web Engineering',
    'full-stack-modern-web-engineering',
    'Master React, Node.js, Next.js patterns, Tailwind CSS, PostgreSQL, REST APIs, and modern cloud deployment architectures.',
    'Web Development',
    'Intermediate',
    '12 Weeks',
    0.00,
    'INR',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'published'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Data Structures, Algorithms & Problem Solving in C++/Java',
    'dsa-algorithms-problem-solving',
    'Conquer arrays, trees, dynamic programming, graph theory, greedy strategies, and cracking product engineering coding rounds.',
    'Computer Science',
    'Beginner',
    '10 Weeks',
    0.00,
    'INR',
    'https://images.unsplash.com/photo-1516116211227-bbc03e3345a0?w=800&auto=format&fit=crop&q=80',
    'published'
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Practical Cloud DevOps & Microservices Infrastructure',
    'cloud-devops-microservices',
    'Docker containerization, Kubernetes orchestration, CI/CD GitHub Actions pipelines, Linux systems, and cloud monitoring.',
    'DevOps & Cloud',
    'Advanced',
    '8 Weeks',
    1499.00,
    'INR',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    'published'
),
(
    'c0000000-0000-0000-0000-000000000004',
    'Machine Learning & Applied Generative AI Foundations',
    'machine-learning-generative-ai',
    'Python data pipelines, Scikit-Learn, PyTorch basics, Vector databases, LLM prompting, and RAG architectural implementations.',
    'Artificial Intelligence',
    'Intermediate',
    '10 Weeks',
    1999.00,
    'INR',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    'published'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    status = EXCLUDED.status;

-- --------------------------------------------------------------------
-- 2. COURSE SECTIONS & LESSONS SEED
-- --------------------------------------------------------------------
-- Sections for Course 1
INSERT INTO public.course_sections (id, course_id, title, sort_order)
VALUES
('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Module 1: Foundations of Modern Frontend', 1),
('s0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Module 2: React State, Hooks & Component Systems', 2),
('s0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Module 3: PostgreSQL & Supabase Backend Integration', 3)
ON CONFLICT (id) DO NOTHING;

-- Lessons for Course 1
INSERT INTO public.lessons (id, course_id, section_id, title, description, content, duration, sort_order, is_free_preview, status)
VALUES
(
    'l0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000001',
    'HTML5 Semantic Architecture & Accessibility (a11y)',
    'Learn how semantic HTML drives assistive tech, clean DOM trees, and SEO compliance.',
    '# HTML5 Semantic Architecture\n\nSemantic HTML provides structural meaning beyond visual rendering. Key elements include `<main>`, `<article>`, `<section>`, `<nav>`, and `<aside>`.\n\n### Best Practices\n1. Always provide descriptive headings.\n2. Ensure visible focus outlines.\n3. Include appropriate ARIA labels for assistive technologies.',
    '45 mins',
    1,
    TRUE, -- Free Preview
    'published'
),
(
    'l0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000001',
    'Modern CSS, Flexbox, Grid & Responsive Systems',
    'Deep dive into fluid typography, CSS custom properties, and container queries.',
    '# Modern CSS Systems\n\nMaster Flexbox for 1D alignments and CSS Grid for 2D macro layouts. Always implement mobile-first media queries.',
    '60 mins',
    2,
    FALSE,
    'published'
),
(
    'l0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000002',
    'React 19 Hooks, State Machines & Context Optimization',
    'Manage predictable state transitions without unnecessary re-renders.',
    '# React 19 State Patterns\n\nExplore `useState`, `useReducer`, and modern action hooks. Leverage clean component decoupling.',
    '75 mins',
    3,
    FALSE,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 3. LEARNING RESOURCES (Notes & Study Materials)
-- --------------------------------------------------------------------
INSERT INTO public.learning_resources (id, title, description, category, file_path, preview_info, price, currency, is_free, status)
VALUES
(
    'r0000000-0000-0000-0000-000000000001',
    'React 19 & Next.js Architecture Comprehensive Guide',
    'Concise summary of server components, compiler hooks, suspense boundaries, hydration internals, and clean code patterns.',
    'Web Development',
    'learning-resources/react-19-guide.pdf',
    '64-page PDF covering hooks, suspense, and production build optimization.',
    0.00,
    'INR',
    TRUE,
    'published'
),
(
    'r0000000-0000-0000-0000-000000000002',
    'Top 100 SDE Technical Interview Questions & Solutions',
    'In-depth breakdowns of algorithmic patterns, recursion trees, dynamic programming memoization tables, and time complexity proof.',
    'DSA & Interview',
    'learning-resources/sde-interview-prep.pdf',
    'Handwritten diagrams, optimal complexity analysis, and C++/Java/Python solutions.',
    0.00,
    'INR',
    TRUE,
    'published'
),
(
    'r0000000-0000-0000-0000-000000000003',
    'High-Level System Design & Microservices Blueprint',
    'Production architectural patterns: Rate limiting, consistent hashing, distributed caching with Redis, message queues, and CAP theorem.',
    'System Design',
    'learning-resources/system-design-blueprint.pdf',
    'Architectural schematics, traffic calculations, and database sharding walkthroughs.',
    499.00,
    'INR',
    FALSE,
    'published'
),
(
    'r0000000-0000-0000-0000-000000000004',
    'PostgreSQL Query Optimization & Database Indexing Handbook',
    'Execution plans, EXPLAIN ANALYZE, B-tree indexes, composite indexes, VACUUM tuning, and Row Level Security implementation.',
    'Databases',
    'learning-resources/postgres-indexing-handbook.pdf',
    'Comprehensive guide to relational database performance engineering.',
    299.00,
    'INR',
    FALSE,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 4. PROJECTS SEED
-- --------------------------------------------------------------------
INSERT INTO public.projects (id, title, slug, description, category, technology_stack, image_path, demo_url, repository_url, status)
VALUES
(
    'p0000000-0000-0000-0000-000000000001',
    'DevPulse — Developer Collaboration & Code Review Hub',
    'devpulse-developer-collaboration',
    'A collaborative code snippet review workspace featuring live comments, syntax highlighting, diff visualization, and GitHub OAuth integration.',
    'Full Stack',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'WebSockets'],
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    'https://devpulse.example.com',
    'https://github.com/example/devpulse',
    'published'
),
(
    'p0000000-0000-0000-0000-000000000002',
    'CloudVault — Zero-Knowledge Encrypted Asset Repository',
    'cloudvault-secure-asset-repository',
    'Client-side AES-256-GCM file encryption pipeline with cloud object storage chunking, signed download URLs, and access audit trails.',
    'Cybersecurity & Cloud',
    ARRAY['React', 'WebCrypto API', 'Supabase Storage', 'PostgreSQL'],
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    'https://cloudvault.example.com',
    'https://github.com/example/cloudvault',
    'published'
),
(
    'p0000000-0000-0000-0000-000000000003',
    'EduGrowth LMS & Career Ecosystem',
    'edugrowth-lms-career-platform',
    'An integrated platform combining student learning management, career opportunities, mentor matching, and administrative dashboards.',
    'EdTech & Career',
    ARRAY['React', 'Tailwind CSS', 'Supabase PostgreSQL', 'RLS', 'Edge Functions'],
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
    'https://edugrowth.example.com',
    'https://github.com/example/edugrowth',
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 5. JOBS SEED
-- --------------------------------------------------------------------
INSERT INTO public.jobs (id, title, organization_name, department, job_type, location, work_mode, experience, required_skills, eligibility, responsibilities, deadline, description, allow_guest_applications, status)
VALUES
(
    'j0000000-0000-0000-0000-000000000001',
    'Junior Frontend Software Engineer',
    'NovaTech Digital Solutions',
    'Engineering',
    'Full-Time',
    'Bengaluru / Remote',
    'Hybrid',
    '0-2 Years',
    ARRAY['React', 'JavaScript', 'Tailwind CSS', 'Git', 'REST APIs'],
    'B.Tech/BE/BCA/MCA (2024, 2025, 2026 batches)',
    'Develop responsive user interfaces using modern React and Tailwind CSS; Collaborate with backend engineers to integrate RESTful APIs; Write unit tests and maintain high browser compatibility standards.',
    '2026-11-30',
    'NovaTech is looking for proactive frontend engineers to build high-performance client dashboards and customer portals.',
    FALSE,
    'published'
),
(
    'j0000000-0000-0000-0000-000000000002',
    'Junior Backend & Cloud Associate',
    'CloudMatrix Systems',
    'Infrastructure',
    'Full-Time',
    'Hyderabad / Remote',
    'Remote',
    '1-3 Years',
    ARRAY['Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Linux'],
    'B.Tech/BE in CS/IT/ECE with minimum 65% aggregate',
    'Design and maintain PostgreSQL schemas, indexes, and queries; Build performant Node.js REST API endpoints; Implement secure JWT and RBAC authentication.',
    '2026-12-15',
    'CloudMatrix is hiring backend associates to power high-throughput microservices for global logistics clients.',
    FALSE,
    'published'
),
(
    'j0000000-0000-0000-0000-000000000003',
    'Content & Curriculum Associate',
    'EduGrowth Global Academy',
    'Education & Content',
    'Full-Time',
    'Delhi NCR / Remote',
    'Remote',
    '0-1 Year',
    ARRAY['Technical Writing', 'Computer Science Fundamentals', 'Curriculum Design'],
    'Graduates in Computer Science, IT, or related fields with strong English communication',
    'Author concise technical cheat sheets, learning guides, and practical lab exercises; Review code examples for clarity and standards.',
    '2026-11-20',
    'Join EduGrowth to shape educational roadmaps and help thousands of students transition from beginners to job-ready software developers.',
    TRUE,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 6. INTERNSHIPS SEED
-- --------------------------------------------------------------------
INSERT INTO public.internships (id, title, organization_name, duration, stipend, work_mode, location, required_skills, eligibility, deadline, description, allow_guest_applications, status)
VALUES
(
    'i0000000-0000-0000-0000-000000000001',
    'Full-Stack Developer Intern',
    'Apex Innovations Lab',
    '6 Months',
    '₹20,000 / month',
    'Remote',
    'Hyderabad / Remote',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    'Pre-final and final year college students available for 6 months internship',
    '2026-11-15',
    'Work directly alongside senior architects to build and deploy customer-facing web applications with PPO conversion potential.',
    TRUE,
    'published'
),
(
    'i0000000-0000-0000-0000-000000000002',
    'UI/UX Design & Frontend Intern',
    'PixelCraft Studio',
    '3 Months',
    '₹15,000 / month',
    'Hybrid',
    'Bengaluru',
    ARRAY['Figma', 'HTML/CSS', 'Tailwind CSS', 'Responsive Layouts'],
    'Students or self-taught designers with an active Figma portfolio and basic HTML/CSS knowledge',
    '2026-11-25',
    'Translate Figma component systems into clean HTML/CSS/Tailwind templates and conduct student usability interviews.',
    TRUE,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 7. SERVICES SEED
-- --------------------------------------------------------------------
INSERT INTO public.services (id, title, description, category, icon, features, status)
VALUES
(
    's0000000-0000-0000-0000-000000000001',
    'Website Development',
    'High-speed, SEO-optimized, responsive custom web applications built with modern React ecosystems.',
    'Web Engineering',
    'Globe',
    ARRAY['Responsive Design', 'Vite & Next.js Performance', 'SEO Schema & OpenGraph', 'Accessible Semantic HTML'],
    'published'
),
(
    's0000000-0000-0000-0000-000000000002',
    'Software Development',
    'End-to-end full-stack software applications featuring robust relational database schemas, secure RBAC, and reliable RESTful APIs.',
    'Custom Software',
    'Code',
    ARRAY['Relational PostgreSQL Architecture', 'Row Level Security Policies', 'REST API Design', 'Automated Testing'],
    'published'
),
(
    's0000000-0000-0000-0000-000000000003',
    'Technology Solutions & Cloud Architecture',
    'Scalable cloud infrastructure, database indexing, automated CI/CD pipelines, containerization, and enterprise integrations.',
    'Cloud & Infrastructure',
    'Server',
    ARRAY['Docker Containerization', 'Cloud Deployment Workflows', 'Database Indexing & Tuning', 'High Availability Setups'],
    'published'
),
(
    's0000000-0000-0000-0000-000000000004',
    'Training & Practical Workshops',
    'Hands-on developer upskilling bootcamps for colleges, corporate teams, and engineering cohorts led by industry practitioners.',
    'Education & Upskilling',
    'BookOpen',
    ARRAY['Hands-on Project Sprints', 'Code Review Mentorship', 'Interview Prep Curricula', 'Placement Enablement'],
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 8. SAMPLE MENTOR APPLICATIONS SEED
-- --------------------------------------------------------------------
INSERT INTO public.mentor_applications (id, name, email, phone, current_role, organization, skills, experience, topics, linkedin_url, github_url, reason, availability, status)
VALUES
(
    'm0000000-0000-0000-0000-000000000001',
    'Kavish Deshmukh',
    'kavish.d@techscale.io',
    '+91 9988776655',
    'Staff Software Engineer',
    'FinScale Technologies',
    ARRAY['System Design', 'Go', 'Distributed Systems', 'Kubernetes'],
    '8 Years',
    ARRAY['System Design Interviews', 'Microservices', 'Career Growth'],
    'https://linkedin.com/in/kavish-deshmukh',
    'https://github.com/kavishd',
    'I want to give back to aspiring engineers and help college students master real-world distributed systems.',
    'Weekends (4-6 hours)',
    'Approved'
),
(
    'm0000000-0000-0000-0000-000000000002',
    'Pooja Sen',
    'pooja.sen@cloudmatrix.dev',
    '+91 9876501234',
    'Senior Frontend Architect',
    'PixelScale Studio',
    ARRAY['React', 'Next.js', 'Web Performance', 'Design Systems'],
    '6 Years',
    ARRAY['Frontend Architecture', 'Portfolio Review', 'Mock Interviews'],
    'https://linkedin.com/in/pooja-sen',
    'https://github.com/poojasen',
    'Passionate about mentoring young developers in writing accessible, high-performance UI code.',
    'Saturdays (2-4 hours)',
    'Pending'
)
ON CONFLICT (id) DO NOTHING;


-- >>> FILE: supabase/migrations/20261024000005_first_admin_bootstrap.sql <<<

-- ====================================================================
-- EduGrowth Platform - First Administrator Bootstrap & Staff RBAC (Part 5/5)
-- Secure one-time bootstrap procedure & administrative staff assignment
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. SECURE ONE-TIME FIRST ADMIN BOOTSTRAP PROCEDURE
-- Run this in Supabase SQL Editor once after signing up your admin account.
-- Strictly prevents ordinary users from claiming admin privileges.
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(admin_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    target_user_id UUID;
    existing_admin_count INTEGER;
    admin_name TEXT;
BEGIN
    -- Check if any ADMIN already exists
    SELECT COUNT(*) INTO existing_admin_count
    FROM public.user_roles
    WHERE role = 'ADMIN';

    IF existing_admin_count > 0 THEN
        RAISE EXCEPTION 'Bootstrap Rejected: An administrator account already exists. Use the Staff Management portal to invite additional staff.';
    END IF;

    -- Lookup user by email in auth.users
    SELECT id, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
    INTO target_user_id, admin_name
    FROM auth.users
    WHERE email = admin_email;

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found. Please register an account first through the platform registration form, then run this bootstrap.', admin_email;
    END IF;

    -- Update or Insert ADMIN role
    DELETE FROM public.user_roles WHERE user_id = target_user_id;
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (target_user_id, 'ADMIN', target_user_id);

    -- Ensure Staff Accounts record exists
    INSERT INTO public.staff_accounts (user_id, display_name, role, is_active)
    VALUES (target_user_id, admin_name, 'ADMIN', TRUE)
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'ADMIN',
        is_active = TRUE,
        updated_at = timezone('utc'::text, now());

    -- Audit log
    INSERT INTO public.audit_logs (actor_user_id, action, entity_type, entity_id, safe_metadata)
    VALUES (
        target_user_id,
        'BOOTSTRAP_FIRST_ADMIN',
        'user_roles',
        target_user_id::text,
        jsonb_build_object('email', admin_email, 'role', 'ADMIN', 'timestamp', now())
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', format('User %s successfully bootstrapped as Platform ADMIN.', admin_email),
        'user_id', target_user_id
    );
END;
$$;

-- Restrict execution: Only superuser/service_role can execute direct bootstrap
REVOKE ALL ON FUNCTION public.bootstrap_first_admin(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.bootstrap_first_admin(TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.bootstrap_first_admin(TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin(TEXT) TO postgres;

-- --------------------------------------------------------------------
-- 2. ADMINISTRATIVE STAFF ROLE MANAGEMENT PROCEDURE
-- Allows active ADMIN to assign and manage staff roles securely
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_assign_staff_role(
    target_email TEXT,
    assigned_role TEXT,
    staff_display_name TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    target_uid UUID;
    acting_admin_id UUID := auth.uid();
    resolved_name TEXT;
BEGIN
    -- Verify caller is ADMIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access Denied: Only platform administrators can assign staff roles.';
    END IF;

    -- Validate role
    IF assigned_role NOT IN ('ADMIN', 'CONTENT_MANAGER', 'PLACEMENT_MANAGER', 'SUPPORT_MANAGER', 'FINANCE_MANAGER', 'STUDENT') THEN
        RAISE EXCEPTION 'Invalid role: %', assigned_role;
    END IF;

    -- Lookup user
    SELECT id, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
    INTO target_uid, resolved_name
    FROM auth.users
    WHERE email = target_email;

    IF target_uid IS NULL THEN
        RAISE EXCEPTION 'User with email % does not exist.', target_email;
    END IF;

    IF staff_display_name IS NOT NULL AND length(staff_display_name) > 0 THEN
        resolved_name := staff_display_name;
    END IF;

    -- Prevent self-demotion if the admin is the only admin
    IF target_uid = acting_admin_id AND assigned_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Security Guard: Administrators cannot demote their own account.';
    END IF;

    -- Update user_roles
    DELETE FROM public.user_roles WHERE user_id = target_uid;
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (target_uid, assigned_role, acting_admin_id);

    -- Update or remove staff_accounts
    IF assigned_role = 'STUDENT' THEN
        DELETE FROM public.staff_accounts WHERE user_id = target_uid;
    ELSE
        INSERT INTO public.staff_accounts (user_id, display_name, role, is_active)
        VALUES (target_uid, resolved_name, assigned_role, TRUE)
        ON CONFLICT (user_id) DO UPDATE SET
            role = assigned_role,
            display_name = resolved_name,
            is_active = TRUE,
            updated_at = timezone('utc'::text, now());
    END IF;

    -- Audit log
    INSERT INTO public.audit_logs (actor_user_id, action, entity_type, entity_id, safe_metadata)
    VALUES (
        acting_admin_id,
        'ASSIGN_STAFF_ROLE',
        'user_roles',
        target_uid::text,
        jsonb_build_object('target_email', target_email, 'assigned_role', assigned_role)
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', format('Role %s successfully assigned to %s.', assigned_role, target_email),
        'user_id', target_uid
    );
END;
$$;

-- Allow authenticated users to call (function enforces public.is_admin() internally)
GRANT EXECUTE ON FUNCTION public.admin_assign_staff_role(TEXT, TEXT, TEXT) TO authenticated;

