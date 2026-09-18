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

-- 8. Insert Categories (19 Categories)
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-1', 'Sparklers', 'sparklers', 1) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-2', 'Flower Pots', 'flower-pots', 2) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-3', 'Chakkars', 'chakkars', 3) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-4', 'Twinkling Star', 'twinkling-star', 4) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-5', 'Toys', 'toys', 5) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-6', 'Bombs', 'bombs', 6) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-7', 'One Sound Crackers', 'one-sound-crackers', 7) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-8', 'Sound Party', 'sound-party', 8) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-9', 'Bijili', 'bijili', 9) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-10', 'Rockets', 'rockets', 10) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-11', 'Wala', 'wala', 11) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-12', 'Kids Magic', 'kids-magic', 12) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-13', 'New Arrivals', 'new-arrivals', 13) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-14', 'Match Box', 'match-box', 14) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-15', 'Mini Sky Flying', 'mini-sky-flying', 15) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-16', 'Special Sky Wonders', 'special-sky-wonders', 16) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-17', 'Repeating Shots', 'repeating-shots', 17) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-18', 'Special Fountains', 'special-fountains', 18) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.categories (id, name, slug, display_order) VALUES ('cat-19', 'Gift Boxes', 'gift-boxes', 19) ON CONFLICT (name) DO NOTHING;

-- 9. Insert All 214 Products (214 Products)
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-1', '7 CM Electric Sparklers (7 CM கம்பி மத்தாப்பு)', 'Sparklers', 80, 70, 80, 'Box', '/images/uploads/_______________jpg_1789742294010.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-2', '7 CM Colour Sparklers (7 CM கம்பி மத்தாப்பு)', 'Sparklers', 52, 10, 80, 'Box', '/images/uploads/_______________jpg_1789742373123.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-3', '7 CM Green Sparklers (7 cm கிரீன் மத்தாப்பு)', 'Sparklers', 60, 12, 80, 'Box', '/images/uploads/_______________jpg_1789743283824.jpg', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-4', '7 CM Red Sparklers (7 cm சிகப்பு கம்பிமத்தாப்பு)', 'Sparklers', 72, 14, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-5', '10 CM Electric Sparklers (10 cm எலெக்ட்ரிக் கம்பிமத்தாப்பு)', 'Sparklers', 72, 14, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-6', '10 Colour Sparklers (10 cm கலர் கம்பிமத்தாப்பு)', 'Sparklers', 88, 18, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-7', '10 CM Green Sparklers (10 cm கிரீன் கம்பிமத்தாப்பு)', 'Sparklers', 100, 20, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-8', '10 CM Red Sparklers (10 cm சிகப்பு கம்பிமத்தாப்பு)', 'Sparklers', 116, 23, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-9', '15 CM Electric Sparklers (15 cm எலெக்ட்ரிக் கம்பிமத்தாப்பு)', 'Sparklers', 172, 34, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-10', '15 CM Colour Sparklers (15 cm கலர் கம்பிமத்தாப்பு)', 'Sparklers', 192, 38, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-11', '15 CM Green Sparklers (15 cm கிரீன் கம்பிமத்தாப்பு)', 'Sparklers', 220, 44, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-12', '15 CM Star Drops Sparklers', 'Sparklers', 256, 51, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-13', '30 CM Star Drops Sparklers (30 cm ஸ்டார் டிராப்)', 'Sparklers', 256, 51, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-14', '15 CM Red Sparklers (15 cm சிகப்பு கம்பிமத்தாப்பு)', 'Sparklers', 248, 50, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-15', '30 CM Electric Sparklers (5 Pcs)', 'Sparklers', 172, 34, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-16', '30 CM Colour Sparklers (5 Pcs)', 'Sparklers', 192, 38, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-17', '30 CM Green Sparklers (5 Pcs)', 'Sparklers', 220, 44, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-18', '30 CM Red Sparklers (5 Pcs)', 'Sparklers', 248, 50, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-19', '15 CM Multi Colour Sparklers (10 Pcs)', 'Sparklers', 256, 51, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-20', '30 Multi Colour Sparklers (5 Pcs)', 'Sparklers', 256, 51, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-21', '50 CM Electric Sparklers (5 Pcs)', 'Sparklers', 704, 141, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-22', '50 CM Colour Sparklers (5 Pcs)', 'Sparklers', 816, 163, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-23', '50 CM Multicolour Sparklers (5 Pcs)', 'Sparklers', 924, 185, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-24', 'Rotating Sparklers (1 Pc)', 'Sparklers', 840, 168, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-26', 'Flower Pots Big (ஃபிளவர் பாட்ஸ் பிக்)', 'Flower Pots', 320, 64, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-27', 'Flower Pots Special (ஃபிளவர் பாட்ஸ் ஸ்பெஷல்)', 'Flower Pots', 396, 79, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-30', 'Colour Koti (கலர் கோட்டி)', 'Flower Pots', 892, 178, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-31', 'Gypsy (5 Pcs) (ஜிப்ஸி)', 'Flower Pots', 752, 150, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-32', 'Colour Koti Special - Pot Girl', 'Flower Pots', 1180, 236, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-33', 'Ground Chakkar Big (தரை சக்கரம் பெரியது)', 'Chakkars', 160, 32, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-34', 'Ground Chakkar Special (தரை சக்கரம் ஸ்பெஷல்)', 'Chakkars', 456, 91, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-35', 'Ground Chakkar Ashoka (10 Pcs)', 'Chakkars', 336, 67, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-36', 'Ground Chakkar Deluxe', 'Chakkars', 760, 152, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-37', 'Cute Prime (10 Pcs) (கியூட் பிரைம்)', 'Chakkars', 792, 158, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-38', 'Disco Wheel (5 Pcs) (டிஸ்கோ வீல்)', 'Chakkars', 248, 50, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-39', 'Lotus Wheel (5 Pcs) (லோட்டஸ் வீல்)', 'Chakkars', 740, 148, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-40', 'Classic Wheel (5 Pcs) (கிளாசிக் வீல்)', 'Chakkars', 480, 96, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-41', 'Zodiac Chakkar (5 Pcs) (ஜோடியக் சக்கர்)', 'Chakkars', 940, 188, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-42', 'Krishna Chakkar (கிருஷ்ணா சக்கர்)', 'Chakkars', 860, 172, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-43', 'Krack Jack Wheel (3 Pcs) (கிராக் ஜாக் வீல்)', 'Chakkars', 1140, 228, 80, 'Box (3 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-45', 'Ring Ring Wheel (ரிங் ரிங் வீல்)', 'Chakkars', 972, 194, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-46', 'Whistling Dixie (விசிலிங்க் டிக்ஸ்சீ)', 'Chakkars', 512, 102, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-47', 'Recycle Wheel (ரீசைக்கிள் வீல்)', 'Chakkars', 880, 176, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-48', '4*4 Wheel (4*4 வீல்)', 'Chakkars', 648, 130, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-49', 'Avengers Wheel (அவென்ஜர்ஸ் வீல்)', 'Chakkars', 584, 117, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-50', '1.5" Twinkling Star (1.5 சாட்டை)', 'Twinkling Star', 116, 23, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-51', '4" Twinkling Star (4" சாட்டை)', 'Twinkling Star', 236, 47, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-52', 'Assorted Cartoon (கார்ட்டூன்)', 'Toys', 96, 19, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-53', 'Snake Cartoon (பாம்பு கார்ட்டூன்)', 'Toys', 108, 22, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-54', 'Ultra Bomb (அல்ட்ரா பாம்)', 'Bombs', 820, 164, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-55', 'Bullet Bomb (புல்லட் பாம்)', 'Bombs', 140, 28, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-56', 'Hydro Bomb (ஹைட்ரோ பாம்)', 'Bombs', 388, 78, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-57', 'Classic Bomb (கிளாசிக் பாம்)', 'Bombs', 490, 98, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-58', 'Digital Bomb (டிஜிட்டல் பாம்)', 'Bombs', 1120, 224, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-59', 'King of King Bomb (கிங் ஆஃப் கிங்)', 'Bombs', 416, 83, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-60', 'Agni Bomb (அக்னி பாம்)', 'Bombs', 840, 168, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-61', '2.75 Kuruvi Crackers (2.75 குருவி வெடி)', 'One Sound Crackers', 24, 5, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-62', '3.5" Lakshmi Sound Crackers (3.5" லக்ஷ்மி வெடி)', 'One Sound Crackers', 40, 8, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-63', '4" Mickey Mouse Sound Crackers (4" மிக்கி மவுஸ் வெடி)', 'One Sound Crackers', 72, 14, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-64', '4" Lakshmi Deluxe (4" லக்ஷ்மி வெடி)', 'One Sound Crackers', 100, 20, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-65', '5" Jallikattu Crackers (5" ஜல்லிக்கட்டு)', 'One Sound Crackers', 220, 44, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-66', '5" Elephant Special (5" யானை ஸ்பெஷல்)', 'One Sound Crackers', 280, 56, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-67', '6" Lion King One Sound (6" லயன் கிங்)', 'One Sound Crackers', 304, 61, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-68', '6" Jurassic One Sound (6" ஜூராசிக்)', 'One Sound Crackers', 304, 61, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-69', 'Two Sound Crackers (டூ சவுண்டு)', 'One Sound Crackers', 152, 30, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-70', 'Gold Lakshmi Crackers (கோல்டு லக்ஷ்மி)', 'One Sound Crackers', 132, 26, 80, 'Pkt (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-71', '1/4 KG Adiyal (1/4 KG அடியாள்)', 'Sound Party', 184, 37, 80, 'Pcs', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-72', '1/2 KG Adiyal (1/2 KG அடியாள்)', 'Sound Party', 368, 74, 80, 'Pcs', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-73', '1 KG Adiyal (1 KG அடியாள்)', 'Sound Party', 736, 147, 80, 'Pcs', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-74', 'Avathar (10 Pcs) (அவதார்)', 'Sound Party', 1040, 208, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-75', 'Colour Paper Bomb (கலர் பேப்பர் பாம்)', 'Sound Party', 240, 48, 80, 'Pcs', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-76', 'Hacker Bomb (10 Pcs) (ஹேக்கர் பாம்)', 'Sound Party', 1500, 300, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-77', 'Red Bijili Crackers (50 Pcs) (ரெட் பிஜிலி)', 'Bijili', 68, 14, 80, 'Pkt (50 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-78', 'Red Bijili Crackers (100 Pcs) (ரெட் பிஜிலி)', 'Bijili', 156, 31, 80, 'Pkt (100 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-79', 'Stripped Bijili (50 Pcs)', 'Bijili', 76, 15, 80, 'Pkt (50 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-80', 'Stripped Bijili Crackers (100 Pcs)', 'Bijili', 196, 39, 80, 'Pkt (100 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-81', 'Baby Rocket (பேபி ராக்கெட்)', 'Rockets', 136, 27, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-82', 'Rocket Bomb', 'Rockets', 260, 52, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-83', 'Lunik Express Rocket', 'Rockets', 504, 101, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-84', 'Whistling Rocket', 'Rockets', 536, 107, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-85', '28 Chorsa', 'Wala', 60, 12, 80, 'Pkt', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-86', '100 Wala', 'Wala', 152, 30, 80, 'Pkt', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-87', 'Magic Whip', 'Wala', 720, 144, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-88', '90 Watts', 'Wala', 600, 120, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-89', 'Shin Chan', 'Wala', 460, 92, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-90', '1000 Wala Budget', 'Wala', 640, 128, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-91', '1000 Wala Premium', 'Wala', 1480, 296, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-92', '2000 Wala Budget', 'Wala', 1280, 256, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-93', '2000 Wala Premium', 'Wala', 2960, 592, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-94', '5000 Wala Budget', 'Wala', 3400, 680, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-95', '5000 Wala Premium', 'Wala', 7600, 1520, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-96', '10000 Wala Budget', 'Wala', 6800, 1360, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-97', '10000 Wala Premium', 'Wala', 15200, 3040, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-98', 'Money Bank', 'Kids Magic', 560, 112, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-99', 'Sound Marriage', 'Kids Magic', 648, 130, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-100', 'Black Money', 'Kids Magic', 960, 192, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-101', 'Money Magic Show Big', 'Kids Magic', 920, 184, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-102', 'Fire Egg', 'Kids Magic', 765, 153, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-103', 'Emu Egg', 'Kids Magic', 720, 144, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-104', 'Oyy Oru Selfi (3 Pcs)', 'Kids Magic', 196, 39, 80, 'Box (3 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-105', 'Snake Tablet 90s Kids', 'Kids Magic', 120, 24, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-106', 'Helicopter (5 Pcs)', 'Kids Magic', 316, 63, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-107', 'Colour Changing Butterfly', 'Kids Magic', 380, 76, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-108', 'Spinner (10 Pcs)', 'Kids Magic', 472, 94, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-109', 'Photo Flash (5 Pcs)', 'Kids Magic', 220, 44, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-110', 'Colour Smoke', 'Kids Magic', 460, 92, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-111', 'Zee Boom Baa (10 Pcs)', 'Kids Magic', 32, 6, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-112', 'Colour Stone (10 Pcs)', 'Kids Magic', 40, 8, 80, 'Box (10 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-113', 'Spyder', 'Kids Magic', 648, 130, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-114', 'Drone', 'Kids Magic', 680, 136, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-115', 'Baby Corn', 'Kids Magic', 832, 166, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-116', 'Popcorn', 'Kids Magic', 832, 166, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-117', 'Pink Panther (Pink Colour) 1 Pc', 'Kids Magic', 840, 168, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-118', 'Lemon Tree Fountain 1 Pc', 'Kids Magic', 560, 112, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-119', 'Lookup (5 Pcs)', 'Kids Magic', 680, 136, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-120', 'Pops Mix', 'Kids Magic', 384, 77, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-121', 'Cylinder Bomb 1 Pc', 'Kids Magic', 700, 140, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-125', 'Popeye Fountain', 'New Arrivals', 696, 139, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-126', 'Dexter Fountain', 'New Arrivals', 696, 139, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-127', 'Bus', 'New Arrivals', 784, 157, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-128', 'Jelly Bean Candle', 'New Arrivals', 320, 64, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-129', 'Pistol Gun 5G', 'New Arrivals', 888, 178, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-130', 'Pistol Gun Small (5 Pcs)', 'New Arrivals', 848, 170, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-131', 'Dora Singer', 'New Arrivals', 576, 115, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-132', 'Paw Patrol Fountain (5 Pcs)', 'New Arrivals', 512, 102, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-134', 'Thor (Hammer)', 'New Arrivals', 760, 152, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-135', 'Seven Up Match Box', 'Match Box', 780, 156, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-136', 'Super Deluxe Match Box', 'Match Box', 360, 72, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-137', 'VIP Match Box', 'Match Box', 1040, 208, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-138', 'Chotta Fancy', 'Mini Sky Flying', 192, 38, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-139', 'Yoga Chotta', 'Mini Sky Flying', 760, 152, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-140', 'Seven Shot (One Time)', 'Mini Sky Flying', 392, 78, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-141', 'Sky Shot', 'Mini Sky Flying', 292, 58, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-141.1', 'Astro Boy (5 Nos)', 'Mini Sky Flying', 600, 120, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-142', 'Natiya Chotta', 'Mini Sky Flying', 760, 152, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-143', 'Mantra Chotta', 'Mini Sky Flying', 760, 152, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-144', '2" Pipe 3 Pcs Window Series', 'Special Sky Wonders', 1440, 288, 80, 'Box (3 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-145', 'Spanka 4 in 1 Function (3 Pcs)', 'Special Sky Wonders', 2600, 520, 80, 'Box (3 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-146', '2.5" Fancy Pipes', 'Special Sky Wonders', 560, 112, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-147', '3.5" Fancy Avengers Series', 'Special Sky Wonders', 1360, 272, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-149', '2.5" Pipe Three Step (3 Pcs) Budget', 'Special Sky Wonders', 1520, 304, 80, 'Box (3 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-150', '2.5" Pipe Three Step (3 Pcs) Premium', 'Special Sky Wonders', 2240, 448, 80, 'Box (3 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-151', '3.5" Wedding Series 7 Step', 'Special Sky Wonders', 1608, 322, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-152', '3.5" Pipe 2 Pcs (Budget)', 'Special Sky Wonders', 2376, 475, 80, 'Box (2 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-153', 'Nayagara Falls (1 Pc)', 'Special Sky Wonders', 1400, 280, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-154', '4.5" Pipe Niger Spl Edition', 'Special Sky Wonders', 1800, 360, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-155', '74 MM Double Ball', 'Special Sky Wonders', 1700, 340, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-156', '3.5" Pipe 2 Pcs Premium', 'Special Sky Wonders', 2400, 480, 80, 'Box (2 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-157', '3.5" Pipe Premium', 'Special Sky Wonders', 1500, 300, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-158', '4" Pipe Premium', 'Special Sky Wonders', 1700, 340, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-159', '4.5" Pipe Special Elite', 'Special Sky Wonders', 1600, 320, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-160', '4.5" Pipe 2 Pcs Elite', 'Special Sky Wonders', 4160, 832, 80, 'Box (2 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-161', '15 Shots Multicolours', 'Repeating Shots', 1100, 220, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-162', '12 Shots Rider', 'Repeating Shots', 720, 144, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-163', '30 Shot Multi Colours', 'Repeating Shots', 1540, 308, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-164', '60 Shots Multicolours', 'Repeating Shots', 3080, 616, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-165', '120 Shots Multicolours', 'Repeating Shots', 6160, 1232, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-166', '240 Multi Shots', 'Repeating Shots', 12320, 2464, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-167', '12 Shot Red & Green', 'Repeating Shots', 892, 178, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-168', '10 Shots Premium', 'Repeating Shots', 900, 180, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-169', 'Speed 30 Premium', 'Repeating Shots', 1900, 380, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-170', '60 Shots Premium', 'Repeating Shots', 3800, 760, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-171', '120 Shots Brand', 'Repeating Shots', 7200, 1440, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-172', '240 Multi Shots Premium', 'Repeating Shots', 18880, 3776, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-173', 'Volcano 30 Crackling With Colour', 'Repeating Shots', 2560, 512, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-174', 'Art of India Setout (20 Shots)', 'Repeating Shots', 14000, 2800, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-175', 'Rang Chakkar Wheel Function (10 Shots)', 'Repeating Shots', 1396, 279, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-176', '12 + 12 Shots', 'Repeating Shots', 880, 176, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-177', 'Caribbean Night 10*10 Shots', 'Repeating Shots', 15000, 3000, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-178', 'Cocktail Setout (40 Shots)', 'Repeating Shots', 11900, 2380, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-179', 'Whistle Ready 49 Shots', 'Repeating Shots', 752, 150, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-179.1', 'Whizzling 25 Shots', 'Repeating Shots', 4500, 900, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-180', 'Peacock Feather', 'Special Fountains', 544, 109, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-181', 'Asrafi Gold', 'Special Fountains', 520, 104, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-182', 'Snow Fountain', 'Special Fountains', 600, 120, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-183', 'Fusion Fountain', 'Special Fountains', 600, 120, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-184', 'Tri Colour Premium', 'Special Fountains', 1100, 220, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-185', 'Bad Boy', 'Special Fountains', 1735, 347, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-186', 'Autumn Rain (1 Pc)', 'Special Fountains', 640, 128, 80, 'Tin (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-187', 'Winter Rain (1 Pc)', 'Special Fountains', 640, 128, 80, 'Tin (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-188', 'Festival Celebration Fountain (3 Pcs)', 'Special Fountains', 1400, 280, 80, 'Box (3 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-189', 'Tricolour Fountain (Budget)', 'Special Fountains', 780, 156, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-190', '2 Pcs Fountain 6 Variety', 'Special Fountains', 784, 157, 80, 'Box (2 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-191', 'Crash Shower (5 Pcs)', 'Special Fountains', 264, 53, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-192', 'Tin Fountain (1 Pc)', 'Special Fountains', 276, 55, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-193', 'Karaoke Night (1 Pc)', 'Special Fountains', 600, 120, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-194', 'Jazz Music (1 Pc)', 'Special Fountains', 600, 120, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-195', 'Dr.Pepper (1 Pc)', 'Special Fountains', 600, 120, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-196', 'Big Bang (1 Pc)', 'Special Fountains', 600, 120, 80, 'Box (1 Pc)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-197', 'Red Apple (5 Pcs)', 'Special Fountains', 784, 157, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-198', 'Carnival Funfair (5 Pcs)', 'Special Fountains', 784, 157, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-199', 'Mr.Big (5 Pcs)', 'Special Fountains', 784, 157, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-200', 'Tooty Frooty (5 Pcs)', 'Special Fountains', 784, 157, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-201', 'Bingo Music (5 Pcs)', 'Special Fountains', 784, 157, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-202', 'Bubbles Multi Colour (5 Pcs)', 'Special Fountains', 856, 171, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-203', 'Water Queen', 'Special Fountains', 816, 163, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-204', 'Madurai Malli', 'Special Fountains', 840, 168, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-205', 'Magic Gold (5 Pcs)', 'Special Fountains', 472, 94, 80, 'Box (5 Pcs)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-206', 'Bada Peacock Starvell Brand', 'Special Fountains', 1296, 259, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-207', 'Bada Pink Peacock', 'Special Fountains', 1760, 352, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-208', 'Golden Peacock', 'Special Fountains', 880, 176, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-209', 'Crackling Peacock', 'Special Fountains', 880, 176, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-210', 'Red & Green Peacock', 'Special Fountains', 880, 176, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-211', 'Magic Feather Peacock Success', 'Special Fountains', 456, 91, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-212', 'Peacock 3 Face Thirumala', 'Special Fountains', 696, 139, 80, 'Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-213', '25 Items Special Gift Box', 'Gift Boxes', 760, 152, 80, 'Box (25 Items)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-214', '30 Items Kutty Japan Gift Box', 'Gift Boxes', 900, 180, 80, 'Box (30 Items)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-215', '35 Items Indian Soldiers Gift Box', 'Gift Boxes', 1200, 240, 80, 'Box (35 Items)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-216', '40 Items Miracle Gift Box', 'Gift Boxes', 1480, 296, 80, 'Box (40 Items)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-217', '50 Items Ravanan (Best Packing Award)', 'Gift Boxes', 1950, 390, 80, 'Box (50 Items)', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-1001', '3000 Mega Diwali Combo Pack', 'Gift Boxes', 5999, 1200, 80, 'Combo Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-1002', '5000 Royal Family Combo Pack', 'Gift Boxes', 9999, 2000, 80, 'Combo Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-1003', '7500 Grand Celebrations Combo Pack', 'Gift Boxes', 14999, 3000, 80, 'Combo Box', '', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('prod-1004', 'Thala Diwali Ultra VIP Combo Pack', 'Gift Boxes', 19999, 4000, 80, 'Mega Box', '', true) ON CONFLICT (id) DO NOTHING;
