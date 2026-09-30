-- ==============================================================================
-- Assign Owner Admin Role to ahmedthor33@gmail.com
-- ==============================================================================

-- 1. Ensure the 'owner' and 'admin' roles exist in public.roles
INSERT INTO public.roles (id, name, description)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'owner', 'Platform Owner with full unrestricted access'),
    ('00000000-0000-0000-0000-000000000002', 'admin', 'Store Administrator for orders, catalog, and reviews')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 2. Confirm email and assign owner metadata in auth.users
UPDATE auth.users
SET 
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "owner", "is_super_admin": true}'::jsonb,
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "owner", "full_name": "Ahmed (Owner)"}'::jsonb
WHERE LOWER(email) = 'ahmedthor33@gmail.com';

-- 3. Upsert profile in public.profiles with owner role
INSERT INTO public.profiles (id, role_id, email, full_name)
SELECT 
    u.id,
    r.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', 'Ahmed (Store Owner)')
FROM auth.users u
CROSS JOIN (SELECT id FROM public.roles WHERE name = 'owner' LIMIT 1) r
WHERE LOWER(u.email) = 'ahmedthor33@gmail.com'
ON CONFLICT (id) DO UPDATE SET
    role_id = EXCLUDED.role_id,
    email = EXCLUDED.email;

-- 4. Update profile role if already exists by email
UPDATE public.profiles
SET role_id = (SELECT id FROM public.roles WHERE name = 'owner' LIMIT 1)
WHERE LOWER(email) = 'ahmedthor33@gmail.com';

-- 5. Output confirmation
SELECT 
    p.id AS profile_id,
    p.email,
    p.full_name,
    r.name AS assigned_role,
    r.description AS role_description,
    p.updated_at
FROM public.profiles p
JOIN public.roles r ON p.role_id = r.id
WHERE LOWER(p.email) = 'ahmedthor33@gmail.com';
