-- ==============================================================================
-- EBA Skin Care - Row Level Security (RLS) Policies (Idempotent)
-- ==============================================================================

-- Helper Function to check if the current user is an Owner, Admin, or Staff
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
    current_role TEXT;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    SELECT r.name INTO current_role
    FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid();

    RETURN current_role IN ('owner', 'admin', 'staff');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;

-- 1. ROLES POLICIES
DROP POLICY IF EXISTS "Allow public read access to roles" ON public.roles;
CREATE POLICY "Allow public read access to roles" ON public.roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admins to manage roles" ON public.roles;
CREATE POLICY "Allow admins to manage roles" ON public.roles FOR ALL USING (public.is_admin());

-- 2. PROFILES POLICIES
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins or users can insert profiles" ON public.profiles;
CREATE POLICY "Admins or users can insert profiles" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid() OR public.is_admin());

-- 3. CATEGORIES POLICIES
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- 4. PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public read published products" ON public.products;
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.is_admin());

-- 5. PRODUCT IMAGES POLICIES
DROP POLICY IF EXISTS "Public read product images" ON public.product_images;
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL USING (public.is_admin());

-- 6. WISHLISTS POLICIES
DROP POLICY IF EXISTS "Users read own wishlist" ON public.wishlists;
CREATE POLICY "Users read own wishlist" ON public.wishlists FOR SELECT USING (user_id = auth.uid() OR session_id IS NOT NULL);

DROP POLICY IF EXISTS "Users insert into wishlist" ON public.wishlists;
CREATE POLICY "Users insert into wishlist" ON public.wishlists FOR INSERT WITH CHECK (user_id = auth.uid() OR session_id IS NOT NULL);

DROP POLICY IF EXISTS "Users delete from wishlist" ON public.wishlists;
CREATE POLICY "Users delete from wishlist" ON public.wishlists FOR DELETE USING (user_id = auth.uid() OR session_id IS NOT NULL);

-- 7. CARTS POLICIES
DROP POLICY IF EXISTS "Users read own cart" ON public.carts;
CREATE POLICY "Users read own cart" ON public.carts FOR SELECT USING (user_id = auth.uid() OR session_id IS NOT NULL);

DROP POLICY IF EXISTS "Users insert cart" ON public.carts;
CREATE POLICY "Users insert cart" ON public.carts FOR INSERT WITH CHECK (user_id = auth.uid() OR session_id IS NOT NULL);

DROP POLICY IF EXISTS "Users update cart" ON public.carts;
CREATE POLICY "Users update cart" ON public.carts FOR UPDATE USING (user_id = auth.uid() OR session_id IS NOT NULL);

DROP POLICY IF EXISTS "Users delete cart" ON public.carts;
CREATE POLICY "Users delete cart" ON public.carts FOR DELETE USING (user_id = auth.uid() OR session_id IS NOT NULL);

-- 8. CART ITEMS POLICIES
DROP POLICY IF EXISTS "Users read cart items" ON public.cart_items;
CREATE POLICY "Users read cart items" ON public.cart_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND (c.user_id = auth.uid() OR c.session_id IS NOT NULL))
);

DROP POLICY IF EXISTS "Users insert cart items" ON public.cart_items;
CREATE POLICY "Users insert cart items" ON public.cart_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND (c.user_id = auth.uid() OR c.session_id IS NOT NULL))
);

DROP POLICY IF EXISTS "Users update cart items" ON public.cart_items;
CREATE POLICY "Users update cart items" ON public.cart_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND (c.user_id = auth.uid() OR c.session_id IS NOT NULL))
);

DROP POLICY IF EXISTS "Users delete cart items" ON public.cart_items;
CREATE POLICY "Users delete cart items" ON public.cart_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND (c.user_id = auth.uid() OR c.session_id IS NOT NULL))
);

-- 9. SHIPPING RATES POLICIES
DROP POLICY IF EXISTS "Public read shipping rates" ON public.shipping_rates;
CREATE POLICY "Public read shipping rates" ON public.shipping_rates FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage shipping rates" ON public.shipping_rates;
CREATE POLICY "Admins manage shipping rates" ON public.shipping_rates FOR ALL USING (public.is_admin());

-- 10. COUPONS POLICIES
DROP POLICY IF EXISTS "Public read active coupons" ON public.coupons;
CREATE POLICY "Public read active coupons" ON public.coupons FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (public.is_admin());

-- 11. ORDERS POLICIES
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL AND guest_email IS NOT NULL)
    OR public.is_admin()
);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin());

-- 12. ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR public.is_admin()))
);

DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (
    quantity > 0 AND unit_price >= 0 AND order_id IS NOT NULL
);

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (public.is_admin());

-- 13. ORDER STATUS HISTORY POLICIES
DROP POLICY IF EXISTS "Users view order status history" ON public.order_status_history;
CREATE POLICY "Users view order status history" ON public.order_status_history FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_status_history.order_id AND (o.user_id = auth.uid() OR public.is_admin()))
);

DROP POLICY IF EXISTS "Admins manage order status history" ON public.order_status_history;
CREATE POLICY "Admins manage order status history" ON public.order_status_history FOR ALL USING (public.is_admin());

-- 14. PAYMENT METHODS POLICIES
DROP POLICY IF EXISTS "Public read enabled payment methods" ON public.payment_methods;
CREATE POLICY "Public read enabled payment methods" ON public.payment_methods FOR SELECT USING (enabled = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage payment methods" ON public.payment_methods;
CREATE POLICY "Admins manage payment methods" ON public.payment_methods FOR ALL USING (public.is_admin());

-- 15. PAYMENTS POLICIES
DROP POLICY IF EXISTS "Users view own order payments" ON public.payments;
CREATE POLICY "Users view own order payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = payments.order_id AND (o.user_id = auth.uid() OR public.is_admin()))
);

DROP POLICY IF EXISTS "Anyone can submit payment proof" ON public.payments;
CREATE POLICY "Anyone can submit payment proof" ON public.payments FOR INSERT WITH CHECK (
    amount >= 0 AND order_id IS NOT NULL
);

DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL USING (public.is_admin());

-- 16. SHIPMENTS POLICIES
DROP POLICY IF EXISTS "Users view order shipments" ON public.shipments;
CREATE POLICY "Users view order shipments" ON public.shipments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = shipments.order_id AND (o.user_id = auth.uid() OR public.is_admin()))
);

DROP POLICY IF EXISTS "Admins manage shipments" ON public.shipments;
CREATE POLICY "Admins manage shipments" ON public.shipments FOR ALL USING (public.is_admin());

-- 17. REVIEWS POLICIES
DROP POLICY IF EXISTS "Public read approved reviews" ON public.reviews;
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (approved = true OR public.is_admin());

DROP POLICY IF EXISTS "Customers insert reviews" ON public.reviews;
CREATE POLICY "Customers insert reviews" ON public.reviews FOR INSERT WITH CHECK (
    rating >= 1 AND rating <= 5 AND reviewer_name IS NOT NULL
);

DROP POLICY IF EXISTS "Admins moderate reviews" ON public.reviews;
CREATE POLICY "Admins moderate reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- 18. NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System/Admins insert notifications" ON public.notifications;
CREATE POLICY "System/Admins insert notifications" ON public.notifications FOR INSERT WITH CHECK (
    user_id IS NOT NULL AND length(title) > 0
);

-- 19. CMS / CONTENT POLICIES (Settings, Nav, Hero, Banners, Footer)
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read nav links" ON public.nav_links;
CREATE POLICY "Public read nav links" ON public.nav_links FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage nav links" ON public.nav_links;
CREATE POLICY "Admins manage nav links" ON public.nav_links FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read hero sections" ON public.hero_sections;
CREATE POLICY "Public read hero sections" ON public.hero_sections FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage hero sections" ON public.hero_sections;
CREATE POLICY "Admins manage hero sections" ON public.hero_sections FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read banners" ON public.banners;
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage banners" ON public.banners;
CREATE POLICY "Admins manage banners" ON public.banners FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public read footer content" ON public.footer_content;
CREATE POLICY "Public read footer content" ON public.footer_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage footer content" ON public.footer_content;
CREATE POLICY "Admins manage footer content" ON public.footer_content FOR ALL USING (public.is_admin());
