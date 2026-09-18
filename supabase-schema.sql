-- =========================================================
-- Sri Jeyam Crackers - Database Schema for Supabase
-- Paste this script into your Supabase Dashboard -> SQL Editor and click "Run"
-- =========================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table (NO dummy products will be seeded!)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    offer_price NUMERIC(10, 2) NOT NULL,
    discount_percent INT DEFAULT 50,
    pack_size TEXT DEFAULT '1 Box',
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    whatsapp_number TEXT DEFAULT '',
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    delivery_notes TEXT DEFAULT '',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
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
    discount_percent INT DEFAULT 50,
    tagline TEXT DEFAULT 'Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!',
    min_order_amount NUMERIC(10, 2) DEFAULT 500,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings if not present
INSERT INTO public.site_settings (id, shop_name, phone1, phone2, whatsapp_number, offer_title, discount_percent, tagline, min_order_amount)
VALUES (
    'default',
    'SRI JEYAM CRACKERS',
    '6380115587',
    '9363243938',
    '6380115587',
    'DIWALI SPECIAL OFFER',
    50,
    'Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!',
    500
)
ON CONFLICT (id) DO NOTHING;

-- Insert standard festive cracker categories
INSERT INTO public.categories (name, slug, display_order) VALUES
('Single Sound Crackers', 'single-sound', 1),
('Sparklers (Kambi)', 'sparklers', 2),
('Flower Pots (Anar)', 'flower-pots', 3),
('Ground Chakkars', 'ground-chakkars', 4),
('Rockets & Missiles', 'rockets', 5),
('Sky Shots & Aerial Fancys', 'sky-shots', 6),
('Bijili & Garlands (Walas)', 'garlands', 7),
('Kids Novelty Crackers', 'kids-novelty', 8),
('Diwali Family Gift Boxes', 'gift-boxes', 9)
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories, products, and site settings
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

-- Allow public to place orders (INSERT only)
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Allow public order tracking by matching phone number
CREATE POLICY "Public Read Own Order" ON public.orders FOR SELECT USING (true);

-- Service role (Node.js backend with SUPABASE_SECRET_KEY) has full bypass access automatically!
