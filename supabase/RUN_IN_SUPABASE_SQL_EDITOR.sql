-- ==============================================================================
-- EBA SKIN CARE — MASTER ADMIN & PERMISSIONS FIX
-- Copy and run this entire script in Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- STEP 1: Fix "permission denied for function is_admin"
-- Grants execution of helper functions to anon, authenticated, and service_role
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO anon, authenticated, service_role;

-- STEP 2: Ensure roles table is readable so role verification never fails
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read roles" ON public.roles;
CREATE POLICY "Public read roles" ON public.roles FOR SELECT USING (true);

-- Ensure default roles exist
INSERT INTO public.roles (id, name, description)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'owner', 'Platform Owner with full unrestricted access'),
    ('00000000-0000-0000-0000-000000000002', 'admin', 'Store Administrator for orders, catalog, and reviews'),
    ('00000000-0000-0000-0000-000000000003', 'staff', 'Operations staff for shipment and order fulfillment'),
    ('00000000-0000-0000-0000-000000000004', 'customer', 'Registered retail customer')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- STEP 3: Assign Owner Role to ahmedthor33@gmail.com
UPDATE auth.users
SET 
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "owner", "is_super_admin": true}'::jsonb,
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "owner", "full_name": "Ahmed (Owner)"}'::jsonb
WHERE LOWER(email) = 'ahmedthor33@gmail.com';

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

UPDATE public.profiles
SET role_id = (SELECT id FROM public.roles WHERE name = 'owner' LIMIT 1)
WHERE LOWER(email) = 'ahmedthor33@gmail.com';

-- STEP 4: Storefront Public Read Policies
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Public read published products" ON public.products;
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Public read shipping rates" ON public.shipping_rates;
CREATE POLICY "Public read shipping rates" ON public.shipping_rates FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Public read active coupons" ON public.coupons;
CREATE POLICY "Public read active coupons" ON public.coupons FOR SELECT USING (is_active = true OR public.is_admin());

-- STEP 5: Admin Manage Policies (Allows Owner / Admin / ahmedthor33@gmail.com)
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'email' = 'ahmedthor33@gmail.com');

DROP POLICY IF EXISTS "Admins manage shipping rates" ON public.shipping_rates;
CREATE POLICY "Admins manage shipping rates" ON public.shipping_rates FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'email' = 'ahmedthor33@gmail.com');

DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'email' = 'ahmedthor33@gmail.com');

-- STEP 6: Site Settings & Hero Sections Tables & Policies
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'email' = 'ahmedthor33@gmail.com');

ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read hero sections" ON public.hero_sections;
CREATE POLICY "Public read hero sections" ON public.hero_sections FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage hero sections" ON public.hero_sections;
CREATE POLICY "Admins manage hero sections" ON public.hero_sections FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'email' = 'ahmedthor33@gmail.com');

-- VERIFICATION: Verify assigned role
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
