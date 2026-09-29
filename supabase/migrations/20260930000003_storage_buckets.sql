-- ==============================================================================
-- EBA Skin Care - Storage Buckets Setup & Policies
-- ==============================================================================

-- 1. Insert Buckets into storage.buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('product-images', 'product-images', true),
    ('banners', 'banners', true),
    ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for product-images (Public read, Admin insert/update/delete)
CREATE POLICY "Public Access to Product Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin Insert Product Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Update Product Images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Delete Product Images" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin());

-- 3. Storage Policies for banners (Public read, Admin insert/update/delete)
CREATE POLICY "Public Access to Banners" ON storage.objects
    FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Admin Insert Banners" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'banners' AND public.is_admin());

CREATE POLICY "Admin Update Banners" ON storage.objects
    FOR UPDATE USING (bucket_id = 'banners' AND public.is_admin());

CREATE POLICY "Admin Delete Banners" ON storage.objects
    FOR DELETE USING (bucket_id = 'banners' AND public.is_admin());

-- 4. Storage Policies for payment-proofs (Anyone can upload payment proof, Admins can view/manage)
CREATE POLICY "Public Upload Payment Proofs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Admins View Payment Proofs" ON storage.objects
    FOR SELECT USING (bucket_id = 'payment-proofs' AND public.is_admin());

CREATE POLICY "Admins Delete Payment Proofs" ON storage.objects
    FOR DELETE USING (bucket_id = 'payment-proofs' AND public.is_admin());
