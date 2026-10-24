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
