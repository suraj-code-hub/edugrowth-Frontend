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
