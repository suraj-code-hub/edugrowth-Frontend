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
