-- =========================================================
-- Sri Jeyam Crackers - Complete Database Setup for Supabase
-- Copy ALL lines from this file and paste them into:
-- Supabase Dashboard -> SQL Editor -> New Query -> Click "Run"
-- =========================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    offer_price NUMERIC(10, 2) NOT NULL,
    discount_percent INT DEFAULT 75,
    pack_size TEXT DEFAULT 'Box',
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    whatsapp_number TEXT DEFAULT '',
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT DEFAULT '',
    delivery_notes TEXT DEFAULT '',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'Cash / UPI',
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    shop_name TEXT DEFAULT 'SRI JEYAM CRACKERS',
    phone1 TEXT DEFAULT '6380115587',
    phone2 TEXT DEFAULT '9363243938',
    whatsapp_number TEXT DEFAULT '6380115587',
    offer_title TEXT DEFAULT 'DIWALI SPECIAL OFFER',
    discount_percent INT DEFAULT 75,
    tagline TEXT DEFAULT 'Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!',
    min_order_amount NUMERIC(10, 2) DEFAULT 500,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 6. Row Level Security Policies (Allow Public Storefront Access)
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Own Order" ON public.orders;
CREATE POLICY "Public Read Own Order" ON public.orders FOR SELECT USING (true);

-- 7. Insert Shop Settings
INSERT INTO public.site_settings (id, shop_name, phone1, phone2, whatsapp_number, offer_title, discount_percent, tagline, min_order_amount)
VALUES ('default', 'SRI JEYAM CRACKERS', '6380115587', '9363243938', '6380115587', 'DIWALI SPECIAL OFFER', 75, 'Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!', 500)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Categories (21 Categories)
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-1', 'Flash Sound Crackers', 'flash-sound-crackers', 1) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-2', 'Flower Pots', 'flower-pots', 2) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-3', 'Ground Chakkars', 'ground-chakkars', 3) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-4', 'Adiyal Crackers', 'adiyal-crackers', 4) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-5', 'Bombs', 'bombs', 5) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-6', 'Fountains', 'fountains', 6) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-7', 'Kids Special', 'kids-special', 7) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-8', 'Peacock Special', 'peacock-special', 8) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-9', 'Sparklers', 'sparklers', 9) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-10', 'Wala', 'wala', 10) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-11', 'Bijili', 'bijili', 11) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-12', 'Rockets', 'rockets', 12) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-13', 'Fancy Aerial', 'fancy-aerial', 13) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-14', '2 Inch 3 Piece', '2-inch-3-piece', 14) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-15', '3 Inch Fountain', '3-inch-fountain', 15) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-16', '4 Inch Fountain', '4-inch-fountain', 16) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-17', '4 Inch Tin', '4-inch-tin', 17) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-18', 'Multicolour Shots', 'multicolour-shots', 18) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-19', 'Special Aerial Shots', 'special-aerial-shots', 19) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-20', 'Combo Packs', 'combo-packs', 20) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-21', 'Gift Boxes', 'gift-boxes', 21) ON CONFLICT (name) DO NOTHING;

-- 9. Insert All 214 Products (130 Products)
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-1', '2 3/4'' Kuruvi', 'Flash Sound Crackers', 80, 14, 83, 'PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-2', '3 1/2'' Lakshmi', 'Flash Sound Crackers', 150, 26, 83, 'PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-3', '4'' Lakshmi', 'Flash Sound Crackers', 200, 34, 83, 'PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-4', '4'' Deluxe Lakshmi', 'Flash Sound Crackers', 300, 51, 83, 'PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-5', '4'' Gold Lakshmi', 'Flash Sound Crackers', 370, 63, 83, 'PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-6', '5'' Jallikattu', 'Flash Sound Crackers', 370, 63, 83, 'PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-7', '2'' Sound', 'Flash Sound Crackers', 350, 60, 83, 'PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-8', '3'' Sound', 'Flash Sound Crackers', 370, 63, 83, 'PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-9', 'Flower Pots Small (10pcs)', 'Flower Pots', 560, 95, 83, 'BOX', '/images/flower_pots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-10', 'Flower Pots Big (10pcs)', 'Flower Pots', 700, 119, 83, 'BOX', '/images/flower_pots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-11', 'Flower Pots Asoka (10pcs)', 'Flower Pots', 1100, 187, 83, 'BOX', '/images/flower_pots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-12', 'Flower Pots Deluxe (5pcs)', 'Flower Pots', 1550, 264, 83, 'BOX', '/images/flower_pots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-13', 'Colour Koti Gold Deluxe (10pcs)', 'Flower Pots', 2250, 383, 83, 'BOX', '/images/flower_pots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-14', 'Flower Pots Super Deluxe (2pcs)', 'Flower Pots', 1050, 179, 83, 'BOX', '/images/flower_pots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-15', 'Mega Lucky Deluxe (10pcs)', 'Flower Pots', 4100, 697, 83, 'BOX', '/images/flower_pots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-16', 'Ground Chakkar Big (10pcs)', 'Ground Chakkars', 450, 77, 83, 'BOX', '/images/chakkars.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-17', 'Ground Chakkar Mega Big', 'Ground Chakkars', 7500, 1275, 83, 'BOX', '/images/chakkars.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-18', 'Ground Chakkar Specials (10Pcs)', 'Ground Chakkars', 770, 131, 83, 'BOX', '/images/chakkars.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-19', 'Ground Chakkar Deluxe (10pcs)', 'Ground Chakkars', 1200, 204, 83, 'BOX', '/images/chakkars.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-20', 'Ground Chakkar Spinner (10pc)', 'Ground Chakkars', 1100, 187, 83, 'BOX', '/images/chakkars.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-21', '1/4 Papper Bomb', 'Adiyal Crackers', 650, 111, 83, 'BOX', '/images/bombs.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-22', '1/2 Papper Bomb', 'Adiyal Crackers', 1300, 221, 83, 'BOX', '/images/bombs.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-23', '1Kg Papper Bomb', 'Adiyal Crackers', 2600, 442, 83, 'BOX', '/images/bombs.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-24', 'Hydro Bomb (10pcs)', 'Bombs', 1000, 170, 83, 'BOX', '/images/bombs.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-25', 'Titan Bomb (10pcs)', 'Bombs', 2350, 400, 83, 'BOX', '/images/bombs.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-26', '555 Bomb (10pcs)', 'Bombs', 750, 128, 83, 'BOX', '/images/bombs.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-27', 'Digital Bomb (10pcs)', 'Bombs', 1900, 323, 83, 'BOX', '/images/bombs.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-28', 'Bullet Bomb (10pcs)', 'Bombs', 260, 44, 83, 'BOX', '/images/bombs.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-29', 'Kutralam', 'Fountains', 1000, 170, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-30', 'Silver Jewellery', 'Fountains', 1550, 264, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-31', 'Tri Colour Fountain', 'Fountains', 2000, 340, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-32', 'Mega Magic', 'Fountains', 2250, 383, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-33', 'Siren', 'Fountains', 2250, 383, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-34', 'Singing Pop', 'Fountains', 950, 162, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-35', 'Drone', 'Kids Special', 1350, 230, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-36', '4X4 Wheel', 'Kids Special', 1400, 238, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-37', 'Kulfi', 'Kids Special', 1200, 204, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-38', 'Bat and Ball', 'Kids Special', 1850, 315, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-39', 'Cylinder', 'Kids Special', 3200, 544, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-40', 'Kng Fu Panda', 'Kids Special', 1400, 238, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-41', 'Bambaram', 'Kids Special', 1000, 170, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-42', 'Helicopter', 'Kids Special', 1050, 179, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-43', 'Buttery Fly', 'Kids Special', 1000, 170, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-44', 'Moving Car', 'Kids Special', 1600, 272, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-45', 'Ostrich Egg', 'Kids Special', 1600, 272, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-46', 'Kinder Joy', 'Kids Special', 1800, 306, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-47', 'Water Queen', 'Kids Special', 1300, 221, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-48', 'Holi Bingo', 'Kids Special', 1600, 272, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-49', 'Holi Colour', 'Kids Special', 1600, 272, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-50', 'Snow Flakes', 'Kids Special', 2200, 374, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-51', 'Kitkat', 'Kids Special', 450, 77, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-52', 'Mottu Bottulu', 'Kids Special', 900, 153, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-53', 'Hand Shower', 'Kids Special', 1800, 306, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-54', 'Money Bank', 'Kids Special', 1000, 170, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-55', 'Selfie Stick', 'Kids Special', 1600, 272, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-56', 'Colour Smoke', 'Kids Special', 1500, 255, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-57', 'Photo Flash', 'Kids Special', 1500, 255, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-58', 'Peacock Colour', 'Peacock Special', 1300, 221, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-59', 'Peacock Magic', 'Peacock Special', 1300, 221, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-60', 'Peacock Colour Magic', 'Peacock Special', 1450, 247, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-61', 'Peacock Bada', 'Peacock Special', 2000, 340, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-62', '7CM Electric Sparklers', 'Sparklers', 80, 14, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-63', '7CM Colour Sparklers', 'Sparklers', 100, 17, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-64', '7CM Grassy Sparklers', 'Sparklers', 110, 19, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-65', '7CM Red Sparklers', 'Sparklers', 110, 19, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-66', '10CM Colour Sparklers', 'Sparklers', 200, 34, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-67', '10CM Grassy Sparklers', 'Sparklers', 220, 37, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-68', '10CM Red Sparklers', 'Sparklers', 220, 37, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-69', '15CM Color Sparklers', 'Sparklers', 460, 78, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-70', '15CM Red Sparklers', 'Sparklers', 480, 82, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-71', '30CM Electric Sparklers', 'Sparklers', 480, 82, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-72', '30CM Colour Sparklers', 'Sparklers', 500, 85, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-73', '30CM Grassy Sparklers', 'Sparklers', 540, 92, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-74', '30CM Red Sparklers', 'Sparklers', 540, 92, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-75', '50CM Electric Sparklers', 'Sparklers', 1500, 255, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-76', '50CM Colour Sparklers', 'Sparklers', 1700, 289, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-77', '50CM Grassy Sparklers', 'Sparklers', 1700, 289, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-78', '70CM Electric Sparklers', 'Sparklers', 1900, 323, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-79', '70CM Colour Sparklers', 'Sparklers', 2000, 340, 83, 'BOX', '/images/sparklers.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-80', 'Dancing Umbrella', 'Sparklers', 2300, 391, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-81', '100 Wala (Full count)', 'Wala', 950, 162, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-82', '1000 Wala (Full count)', 'Wala', 2700, 459, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-83', '2000 Wala (Full count)', 'Wala', 5400, 918, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-84', '5000 Wala (Full count)', 'Wala', 17000, 2890, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-85', '10,000 Wala (Full count)', 'Wala', 32000, 5440, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-86', 'Gold Bijili (50 pcs)', 'Bijili', 140, 24, 83, '1 PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-87', 'Gold Bijili (100 pcs)', 'Bijili', 220, 37, 83, '1 PKT', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-88', 'Rocket Bomb', 'Rockets', 1000, 170, 83, 'BOX', '/images/rockets.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-89', 'Whistling Rocket', 'Rockets', 1500, 255, 83, 'BOX', '/images/rockets.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-90', 'Chotta Fancy', 'Fancy Aerial', 600, 102, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-91', '3 Piece Fancy', 'Fancy Aerial', 2200, 374, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-92', 'Sunny Guys', 'Fancy Aerial', 3300, 561, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-93', 'Enjoy the Night', '2 Inch 3 Piece', 2200, 374, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-94', 'Cool Boys', '2 Inch 3 Piece', 2200, 374, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-95', 'Cool Dude', '2 Inch 3 Piece', 2200, 374, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-96', 'Flamezone', '3 Inch Fountain', 2300, 391, 83, '1PCS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-97', 'Blues', '3 Inch Fountain', 2300, 391, 83, '1PCS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-98', 'Blazzers', '3 Inch Fountain', 2300, 391, 83, '1PCS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-99', 'Paris', '4 Inch Fountain', 2900, 493, 83, '1 PCS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-100', 'Tokyo', '4 Inch Fountain', 2900, 493, 83, '1 PCS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-101', 'Venise', '4 Inch Fountain', 2900, 493, 83, '1 PCS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-102', 'Jack Daniels', '4 Inch Tin', 3600, 612, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-103', 'Powers Gold Label', '4 Inch Tin', 3600, 612, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-104', 'Signature', '4 Inch Tin', 3600, 612, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-105', 'Blue Label', '4 Inch Tin', 3600, 612, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-106', '12 Shot Raider', 'Multicolour Shots', 1250, 213, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-107', 'Rainbow Light (12 Shot)', 'Multicolour Shots', 600, 102, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-108', '15 Multi Colour Shot', 'Multicolour Shots', 2300, 391, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-109', '25 Multi Colour Shot', 'Multicolour Shots', 3100, 527, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-110', '30 Shot Raider', 'Multicolour Shots', 3800, 646, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-111', '30 Shot Multi Colour', 'Multicolour Shots', 3900, 663, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-112', '60 Shot (Colour Light)', 'Multicolour Shots', 7800, 1326, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-113', '60 Shot (Bonza)', 'Multicolour Shots', 7800, 1326, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-114', '120 Shot Multicolour', 'Multicolour Shots', 15600, 2652, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-115', '240 Shot Multi Colour', 'Multicolour Shots', 31200, 5304, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-116', 'Double Shot Ball', 'Special Aerial Shots', 3200, 544, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-117', 'Triple Shot Ball', 'Special Aerial Shots', 3800, 646, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-118', '10X10 Subah Vila', 'Special Aerial Shots', 32000, 5440, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-119', '10X10 Weave', 'Special Aerial Shots', 32000, 5440, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-120', '3X10 Shadi Ki Rangoli', 'Special Aerial Shots', 27000, 4590, 83, 'BOX', '/images/repeating_shots.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-121', '3000 COMBO', 'Combo Packs', 30000, 5100, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-122', '5000 COMBO', 'Combo Packs', 50000, 8500, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-123', '7500 COMBO', 'Combo Packs', 75000, 12750, 83, 'BOX', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-124', 'FERRARI 20 ITEMS', 'Gift Boxes', 2200, 374, 83, '20 ITEMS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-125', 'LAMBOGHINI 25 ITEMS', 'Gift Boxes', 3100, 527, 83, '25 ITEMS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-126', 'AUDI 30 ITEMS', 'Gift Boxes', 3800, 646, 83, '30 ITEMS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-127', 'BMW 35 ITEMS', 'Gift Boxes', 5100, 867, 83, '35 ITEMS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-128', 'JAGUAR 40 ITEMS', 'Gift Boxes', 5900, 1003, 83, '40 ITEMS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-129', 'THALAM 50 ITEMS', 'Gift Boxes', 7250, 1233, 83, '50 ITEMS', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-130', 'VIP 60 ITEMS', 'Gift Boxes', 9500, 1615, 83, '60 ITEMS', '', true) ON CONFLICT (id) DO NOTHING;
