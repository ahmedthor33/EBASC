-- ==============================================================================
-- Fix Permission Denied for is_admin() and RLS evaluation across Supabase
-- This resolves: "permission denied for function is_admin"
-- ==============================================================================

-- 1. Grant execute permissions on helper functions to anon and authenticated
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO anon, authenticated, service_role;

-- 2. Allow public to read roles table so role resolution works cleanly
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read roles" ON public.roles;
CREATE POLICY "Public read roles" ON public.roles FOR SELECT USING (true);

-- 3. Ensure categories, products, shipping rates, and coupons have clean fallback SELECT policies
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Public read published products" ON public.products;
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Public read shipping rates" ON public.shipping_rates;
CREATE POLICY "Public read shipping rates" ON public.shipping_rates FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Public read active coupons" ON public.coupons;
CREATE POLICY "Public read active coupons" ON public.coupons FOR SELECT USING (is_active = true OR public.is_admin());

-- 4. Enable admin manage policies
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins manage shipping rates" ON public.shipping_rates;
CREATE POLICY "Admins manage shipping rates" ON public.shipping_rates FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (public.is_admin());

-- 5. Site Settings and Hero Sections policies
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

