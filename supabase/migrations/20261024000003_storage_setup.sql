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
