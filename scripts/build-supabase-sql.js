const fs = require('fs');
const path = require('path');

const store = JSON.parse(fs.readFileSync(path.join(__dirname, '../server/data/store.json'), 'utf8'));

let sql = `-- =========================================================
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

-- 8. Insert Categories (${store.categories.length} Categories)
`;

for (const cat of store.categories) {
  const safeName = cat.name.replace(/'/g, "''");
  const safeSlug = (cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/'/g, "''");
  sql += `INSERT INTO public.categories (id, name, slug, display_order) VALUES ('${cat.id}', '${safeName}', '${safeSlug}', ${cat.display_order || 1}) ON CONFLICT (name) DO NOTHING;\n`;
}

sql += `\n-- 9. Insert All 214 Products (${store.products.length} Products)\n`;

for (const p of store.products) {
  const safeName = p.name.replace(/'/g, "''");
  const safeCat = p.category.replace(/'/g, "''");
  const safePack = (p.pack_size || 'Box').replace(/'/g, "''");
  const safeImg = (p.image_url || '').replace(/'/g, "''");
  sql += `INSERT INTO public.products (id, name, category, original_price, offer_price, discount_percent, pack_size, image_url, in_stock) VALUES ('${p.id}', '${safeName}', '${safeCat}', ${p.original_price}, ${p.offer_price}, ${p.discount_percent || 75}, '${safePack}', '${safeImg}', ${p.in_stock !== false}) ON CONFLICT (id) DO NOTHING;\n`;
}

const targetPath = path.join(__dirname, '../supabase-complete-setup.sql');
fs.writeFileSync(targetPath, sql, 'utf8');
console.log(`Generated ${targetPath} successfully with ${store.categories.length} categories and ${store.products.length} products!`);
