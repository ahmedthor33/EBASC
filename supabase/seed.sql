-- ==============================================================================
-- EBA Skin Care - Seed Data
-- ==============================================================================

-- 1. SEED ROLES
INSERT INTO public.roles (id, name, description)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'owner', 'Platform Owner with full unrestricted access'),
    ('00000000-0000-0000-0000-000000000002', 'admin', 'Store Administrator for orders, catalog, and reviews'),
    ('00000000-0000-0000-0000-000000000003', 'staff', 'Operations staff for shipment and order fulfillment'),
    ('00000000-0000-0000-0000-000000000004', 'customer', 'Registered retail customer')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 2. SEED CATEGORIES (Men and Women)
INSERT INTO public.categories (id, name, slug, description, gender_target, display_order, is_active)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'Women Collection', 'women', 'Luxury botanical skincare formulations meticulously tailored for radiant feminine skin.', 'women', 1, true),
    ('10000000-0000-0000-0000-000000000002', 'Men Collection', 'men', 'High-performance charcoal & peptide grooming essentials engineered for resilience.', 'men', 2, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED PRODUCTS (3 each for Men and Women)
-- Men Products
INSERT INTO public.products (
    id, category_id, name, slug, description, how_to_use, size, price, sale_price, sku, stock, status, is_featured, is_best_seller, rating, reviews_count
) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Men Face Wash 100ml',
    'men-face-wash-100ml',
    'Activated volcanic charcoal detox cleanser that extracts urban impurities, controls sebum, and tightens pores without stripping moisture.',
    'Lather a dime-sized amount with lukewarm water. Massage gently onto damp skin in circular motions for 60 seconds. Rinse thoroughly with cool water.',
    '100ml',
    1850.00,
    1550.00,
    'EBA-M-FW100',
    120,
    'published',
    true,
    true,
    4.9,
    48
),
(
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'Men Beauty Night Whitening Cream 50gm',
    'men-beauty-night-whitening-cream-50gm',
    'High-potency night repair formula infused with Alpha Arbutin, Ceramides, and Peptides to fade hyperpigmentation and restore the moisture barrier.',
    'Apply evenly across cleansed face and neck every evening before sleep. Press lightly with fingertips until fully absorbed.',
    '50gm',
    2650.00,
    2250.00,
    'EBA-M-NWC50',
    85,
    'published',
    true,
    false,
    4.8,
    36
),
(
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    'Men Beauty Glow Serum 30ml',
    'men-beauty-glow-serum-30ml',
    'Triple-strength Niacinamide 10% + Zinc PCA and Hyaluronic concentrate designed to energize fatigued skin, combat sun damage, and impart subtle matte radiance.',
    'Dispense 3-4 drops onto palms and pat gently onto clean skin before moisturizer. Ideal for morning and evening routines.',
    '30ml',
    3200.00,
    2850.00,
    'EBA-M-BGS30',
    95,
    'published',
    true,
    true,
    5.0,
    62
),

-- Women Products
(
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'Women Face Wash 100ml',
    'women-face-wash-100ml',
    'Velvety botanical foaming cleanser infused with Damask Rose Hydrosol, Aloe Vera, and mild amino acids that gently washes away impurities while maintaining dewy moisture.',
    'Pump into hands and massage across face and neck in soft circular motions. Rinse with tepid water and pat dry with a soft muslin towel.',
    '100ml',
    1950.00,
    1650.00,
    'EBA-W-FW100',
    150,
    'published',
    true,
    true,
    4.9,
    74
),
(
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000001',
    'Women Beauty Night Whitening Cream 50gm',
    'women-beauty-night-whitening-cream-50gm',
    'Rich regenerative nighttime elixir with Licorice Root, Squalane, and Niacinamide. Evens skin tone, reduces stubborn blemishes, and produces waking luminosity.',
    'Warm a pearl-sized amount between fingertips and smooth upward over face and decolletage every night.',
    '50gm',
    2750.00,
    2350.00,
    'EBA-W-NWC50',
    110,
    'published',
    true,
    true,
    4.9,
    91
),
(
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000001',
    'Women Beauty Glow Serum 30ml',
    'women-beauty-glow-serum-30ml',
    'Multi-molecular Hyaluronic Acid blended with 24K Gold micro-flecks and stabilized Vitamin C for immediate glass-skin radiance and long-term collagen synthesis.',
    'Apply 3 drops onto clean skin, patting in with upward motions. Follow with sunscreen in the morning or night cream in the evening.',
    '30ml',
    3450.00,
    2950.00,
    'EBA-W-BGS30',
    140,
    'published',
    true,
    true,
    5.0,
    118
)
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED PRODUCT IMAGES
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
    ('20000000-0000-0000-0000-000000000001', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qZKfD-MmNm5hiTS0HR2ypZ0igcS6R30TPE3Xf10lTaRD9-R6qXgi0w2Wu03vrOF4jWOw85hlWh9ScTihOZ-pgdzAOLXjtRYY_aukHaqLSevRJS0l4ztJNpZabWPnX_1ALl_vC19arWn07UgRWg9wZNBGWULzs0Gt-8Xad_k9eX7-DstSzrErdwitiv8nqunUa9qxw7goA7MGiHygDpenhWwEH_cEQoQ1Z8wJEAB14aRszcSwRShcZA', 'Men Face Wash 100ml', 1, true),
    ('20000000-0000-0000-0000-000000000002', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBede5n6vHSjvSEo6HFPy-9XnRgImReYufmS4PYtOBB8qEcEJbNFITKGj-E466tEhN0CdlwPanqjSCkftaDfzkp329LEwqMRXLjmq0y4DGHbPHTk1_5WADtIm_T2umNzQj7S2tRJ0GbJFyzJ7ro32cMMRs6OdQgF0NztV2vOlXOOdYKoLJa-t2elyYrELgDgkGQOk6_j4gOWnvN177oRq1KclysBnIBVFV47VjZYkhJr7wHpBfMvCHRmA', 'Men Beauty Night Whitening Cream 50gm', 1, true),
    ('20000000-0000-0000-0000-000000000003', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5ggLpWr_yUYNWWyLl3bqHl417Ucz9SOur5chA-Crc9hDjsYjeAv9K2EEfah5fVgZHfuaHMLbAYTyD-eVjooQ7LsZOmNJuQ4jcCoX-lp4BbIXhzETbafOZ5zEBOk6yNSi28Luc2GjWfM4dHLmznsSnfBk8omTo7lLkzPr9oOk2gxJH7bRsjjC4rxRzsKjpYdLbl6P1OHPsYJU4fuI3m9Wz91wO1tF1FVsinHnpZbLjj5NI0CoIXxTjLQ', 'Men Beauty Glow Serum 30ml', 1, true),
    ('20000000-0000-0000-0000-000000000004', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkv5jVPPTESDqRukEOVPhDdyl8VS4CvYWHOSOPukgL9jJixKDUcHcsY2B0lKkhoqelpkgzzWTLRM6kAqQigYusDKXpxYlZBYskWxvO8jq2vAYzWDsL_geWxXSfxSQLaOhR_HEuwhXNlCXBfiOB08fBWp2DrTAg2Pe_fLxISsln5sj8QVN3IP8V3B-bo70OnfIe4LQs4VG8IT8Kr4KrK2NVcuSzvkHroPpG4sUjbf-RC9OrDFcy-IBPYQ', 'Women Face Wash 100ml', 1, true),
    ('20000000-0000-0000-0000-000000000005', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlOJoPgKGYUTFyrU6Zkru90zysTKfNIA4WC0fjWWHRJmUI181UrP1n64fpKiIZ3rMJr6HhkDWyTrC53gMDjEcXGh1SXlC4ZlCKX8FFMEV8Q7E872J-un1b7RAwbBaMqbjKDcYJ5DLdji-2WfzWnFoR6t9lN-uKhDrKpeqJITYrEZU3ZGkD5QkHH1PSRhBr_GNkxRHIvAzbt4s_WpNr25tYizGsnxp_2nU-oUVqZxEZn95dhwawTgezCw', 'Women Beauty Night Whitening Cream 50gm', 1, true),
    ('20000000-0000-0000-0000-000000000006', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8ofYqbiGkydJ2SZOCyCIDLn6ySlHsTOxaKAZXPL8ewfFRmDu51L43o2oGCFpNEh1DKuznN8bC-OtlGEfK3ASGQeCLKIdqgRJ2A6B5r0B0uOazSVMg176BVbrUfnwUDLfdlTKHWxveW95UH053tfMsQrkBYD3mPJ1j5-YvTE917F7zTQxu8eZeRX1rpDYo_yiwH_UdrTMRraRheRau5soS-OI_faLUVgylPAJuibDeFlaMSudLje5I0A', 'Women Beauty Glow Serum 30ml', 1, true)
ON CONFLICT DO NOTHING;

-- 5. SEED PAYMENT METHODS (Cash on Delivery, JazzCash, EasyPaisa, Bank Transfer)
INSERT INTO public.payment_methods (name, slug, enabled, account_title, account_number, instructions, display_order)
VALUES
(
    'Cash on Delivery (COD)',
    'cash_on_delivery',
    true,
    NULL,
    NULL,
    'Pay in cash to courier agent upon delivery. Please keep exact change ready.',
    1
),
(
    'JazzCash',
    'jazzcash',
    true,
    'EBA Skin Care Pvt Ltd',
    '0300 1234567',
    'Send payment to JazzCash account 0300 1234567 (Title: EBA Skin Care Pvt Ltd). After payment, enter your Transaction ID (TID) or upload screenshot.',
    2
),
(
    'EasyPaisa',
    'easypaisa',
    true,
    'EBA Skin Care Pvt Ltd',
    '0345 7654321',
    'Send payment to EasyPaisa mobile account 0345 7654321 (Title: EBA Skin Care Pvt Ltd). Enter TID or attach confirmation receipt.',
    3
),
(
    'Direct Bank Transfer',
    'bank_transfer',
    true,
    'EBA Skin Care (Private) Limited',
    'IBAN: PK36MEZN0001020304050607 (Meezan Bank Limited, Clifton Branch)',
    'Transfer total amount to our Meezan Bank account. Mention your Order Number in payment remarks and upload transfer receipt.',
    4
)
ON CONFLICT (slug) DO UPDATE SET
    account_title = EXCLUDED.account_title,
    account_number = EXCLUDED.account_number,
    instructions = EXCLUDED.instructions;

-- 6. SEED SHIPPING RATES
INSERT INTO public.shipping_rates (name, rate, free_shipping_threshold, estimated_days, is_active)
VALUES
    ('Nationwide Standard Courier (Pakistan)', 200.00, 3500.00, '2-4 business days across Pakistan', true)
ON CONFLICT DO NOTHING;

-- 7. SEED COUPONS
INSERT INTO public.coupons (code, type, value, min_order, usage_limit, times_used, expiry, is_active)
VALUES
    ('EBAWELCOME', 'percentage', 10.00, 1500.00, 500, 12, now() + interval '180 days', true),
    ('GLOW500', 'fixed', 500.00, 4000.00, 200, 8, now() + interval '90 days', true)
ON CONFLICT (code) DO NOTHING;

-- 8. SEED CMS CONTENT (Hero Sections, Banners, Nav Links, Footer)
-- Hero Sections
INSERT INTO public.hero_sections (category_mode, badge_text, title, subtitle, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, image_url, is_active)
VALUES
(
    'all',
    'Clinique Botanica • South Asia',
    'High-Performance Radiance, Tailored for Every Skin.',
    'Clinically proven botanical formulations engineered for South Asian climates. Dermatologically tested, cruelty-free, and meticulously calibrated for Men and Women.',
    'Shop Women Collection',
    '/women',
    'Shop Men Collection',
    '/men',
    '/images/hero_women.png',
    true
),
(
    'women',
    'The Women Collection',
    'Luminescence & Velvety Restoration.',
    'Infused with Damask Rose, Peptides, and 24K botanical gold essence to awaken glowing translucence.',
    'Shop Women Rituals',
    '/women',
    'Explore All Products',
    '/shop?category=women',
    '/images/hero_women.png',
    true
),
(
    'men',
    'The Men Collection',
    'Obsidian Slate Fortitude & Pore Purity.',
    'Charcoal detox and high-potency barrier defence calibrated for urban exposure, humidity, and active daily performance.',
    'Shop Men Essentials',
    '/men',
    'Explore All Products',
    '/shop?category=men',
    '/images/hero_men.png',
    true
)
ON CONFLICT DO NOTHING;

-- Banners
INSERT INTO public.banners (title, subtitle, image_url, target_url, placement, display_order, is_active)
VALUES
(
    'Free Nationwide Delivery',
    'Complimentary shipping across Pakistan on all orders over Rs. 3,500',
    '/images/hero_women.png',
    '/shop',
    'announcement_bar',
    1,
    true
),
(
    'Bespoke Regimen Formulation',
    'Dermatologically calibrated for South Asian climates',
    '/images/hero_men.png',
    '/shop',
    'home_top',
    2,
    true
)
ON CONFLICT DO NOTHING;

-- Nav Links
INSERT INTO public.nav_links (label, url, display_order, is_active)
VALUES
    ('Home', '/', 1, true),
    ('Men', '/men', 2, true),
    ('Women', '/women', 3, true),
    ('Shop', '/shop', 4, true),
    ('About Us', '/about-us', 5, true),
    ('Contact Us', '/contact-us', 6, true)
ON CONFLICT DO NOTHING;

-- Footer Content
INSERT INTO public.footer_content (section_title, links, display_order)
VALUES
(
    'EBA Collections',
    '[{"label":"Women Collection","url":"/women"},{"label":"Men Collection","url":"/men"},{"label":"All Formulations","url":"/shop"},{"label":"Bestsellers","url":"/shop?filter=bestseller"}]'::jsonb,
    1
),
(
    'Client Care',
    '[{"label":"Order Tracking","url":"/my-account"},{"label":"Return & Refund Policy","url":"/return-and-refund-policy"},{"label":"Privacy Policy","url":"/privacy-policy"},{"label":"Contact Us","url":"/contact-us"}]'::jsonb,
    2
),
(
    'Apothecary Heritage',
    '[{"label":"Our Story & Philosophy","url":"/about-us"},{"label":"Clinical Standards","url":"/about-us#clinical"},{"label":"Halal & Cruelty Free","url":"/about-us#standards"}]'::jsonb,
    3
)
ON CONFLICT DO NOTHING;

-- Site Settings
INSERT INTO public.site_settings (key, value, description)
VALUES
(
    'general',
    '{"store_name":"EBA Skin Care","currency":"PKR","currency_symbol":"Rs.","country":"Pakistan","phone":"+92 21 3589 1234","email":"care@ebaskincare.pk","address":"Clifton Block 4, Karachi, Pakistan"}'::jsonb,
    'Store general configuration'
),
(
    'shipping',
    '{"free_shipping_threshold":3500,"default_fee":200,"allowed_country":"Pakistan"}'::jsonb,
    'Shipping fees and thresholds'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
