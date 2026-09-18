const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { supabase, loadLocalStore, saveLocalStore } = require('../config/supabase');

// Helper to check if Supabase table is usable
async function useSupabaseProducts() {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
}

// 1. GET all products (Public - no login needed)
router.get('/', async (req, res) => {
  const { category, search, in_stock_only } = req.query;

  try {
    const hasSupabase = await useSupabaseProducts();

    if (hasSupabase) {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (in_stock_only === 'true') {
        query = query.eq('in_stock', true);
      }
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.json(data || []);
    }

    // Local store fallback
    const store = loadLocalStore();
    let list = store.products || [];

    if (category && category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (in_stock_only === 'true') {
      list = list.filter(p => p.in_stock);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)));
    }

    return res.json(list);
  } catch (err) {
    console.error('Error fetching products:', err);
    // Fallback to local store
    const store = loadLocalStore();
    return res.json(store.products || []);
  }
});

// 2. GET categories (Public)
router.get('/categories', async (req, res) => {
  try {
    const hasSupabase = await useSupabaseProducts();
    if (hasSupabase) {
      const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }

    const store = loadLocalStore();
    return res.json(store.categories || []);
  } catch (err) {
    const store = loadLocalStore();
    return res.json(store.categories || []);
  }
});

// 3. POST create product (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  const {
    name,
    category,
    original_price,
    offer_price,
    discount_percent = 50,
    pack_size = '1 Box',
    description = '',
    image_url = '',
    in_stock = true
  } = req.body;

  if (!name || original_price === undefined) {
    return res.status(400).json({ error: 'Product name and original price are required' });
  }

  const origPriceNum = parseFloat(original_price);
  const discPercent = parseInt(discount_percent) || 50;
  // Compute offer price if not provided (50% off by default)
  const calcOfferPrice = offer_price !== undefined ? parseFloat(offer_price) : Math.round(origPriceNum * (1 - discPercent / 100));

  const newProduct = {
    id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: name.trim(),
    category: category || 'General',
    original_price: origPriceNum,
    offer_price: calcOfferPrice,
    discount_percent: discPercent,
    pack_size: pack_size || '1 Box',
    description: description || '',
    image_url: image_url || '',
    in_stock: in_stock !== false,
    created_at: new Date().toISOString()
  };

  try {
    const hasSupabase = await useSupabaseProducts();
    if (hasSupabase) {
      const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    // Save to local store
    const store = loadLocalStore();
    store.products = store.products || [];
    store.products.unshift(newProduct);
    saveLocalStore(store);

    return res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error inserting product:', err);
    const store = loadLocalStore();
    store.products = store.products || [];
    store.products.unshift(newProduct);
    saveLocalStore(store);
    return res.status(201).json(newProduct);
  }
});

// 4. POST bulk create products (Admin only - for quick data entry!)
router.post('/bulk', requireAdmin, async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Products array is required' });
  }

  const processed = products.map((p, index) => {
    const orig = parseFloat(p.original_price || p.price || 0);
    const disc = parseInt(p.discount_percent) || 50;
    const offer = p.offer_price ? parseFloat(p.offer_price) : Math.round(orig * (1 - disc / 100));

    return {
      id: 'prod-' + Date.now() + '-' + index + '-' + Math.random().toString(36).substring(2, 5),
      name: (p.name || 'Cracker Item').trim(),
      category: (p.category || 'General').trim(),
      original_price: orig,
      offer_price: offer,
      discount_percent: disc,
      pack_size: p.pack_size || '1 Box',
      description: p.description || '',
      image_url: p.image_url || '',
      in_stock: p.in_stock !== false,
      created_at: new Date().toISOString()
    };
  });

  try {
    const hasSupabase = await useSupabaseProducts();
    if (hasSupabase) {
      const { data, error } = await supabase.from('products').insert(processed).select();
      if (error) throw error;
      return res.status(201).json({ count: data.length, products: data });
    }

    const store = loadLocalStore();
    store.products = store.products || [];
    store.products = [...processed, ...store.products];
    saveLocalStore(store);

    return res.status(201).json({ count: processed.length, products: processed });
  } catch (err) {
    console.error('Error in bulk import:', err);
    const store = loadLocalStore();
    store.products = store.products || [];
    store.products = [...processed, ...store.products];
    saveLocalStore(store);
    return res.status(201).json({ count: processed.length, products: processed });
  }
});

// 5. PUT update product (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body, updated_at: new Date().toISOString() };

  if (updates.original_price !== undefined) {
    updates.original_price = parseFloat(updates.original_price);
    const disc = updates.discount_percent !== undefined ? parseInt(updates.discount_percent) : 50;
    if (updates.offer_price === undefined) {
      updates.offer_price = Math.round(updates.original_price * (1 - disc / 100));
    }
  }

  try {
    const hasSupabase = await useSupabaseProducts();
    if (hasSupabase) {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.json(data);
    }

    const store = loadLocalStore();
    const index = (store.products || []).findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    store.products[index] = { ...store.products[index], ...updates };
    saveLocalStore(store);
    return res.json(store.products[index]);
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

// 6. DELETE product (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const hasSupabase = await useSupabaseProducts();
    if (hasSupabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Product deleted' });
    }

    const store = loadLocalStore();
    store.products = (store.products || []).filter(p => p.id !== id);
    saveLocalStore(store);
    return res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

// 7. POST batch update discount for a category or all products (Admin only)
router.post('/batch-discount', requireAdmin, async (req, res) => {
  const { category, discount_percent } = req.body;
  const disc = parseInt(discount_percent);
  if (isNaN(disc) || disc < 0 || disc > 100) {
    return res.status(400).json({ error: 'Valid discount percent is required (0-100)' });
  }

  try {
    const store = loadLocalStore();
    let updatedCount = 0;
    store.products = (store.products || []).map(p => {
      if (!category || category === 'all' || p.category.toLowerCase() === category.toLowerCase()) {
        const orig = parseFloat(p.original_price || 0);
        const newOffer = Math.round(orig * (1 - disc / 100));
        updatedCount++;
        return {
          ...p,
          discount_percent: disc,
          offer_price: newOffer,
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });

    saveLocalStore(store);

    const hasSupabase = await useSupabaseProducts();
    if (hasSupabase) {
      for (const p of store.products) {
        await supabase.from('products').update({
          discount_percent: p.discount_percent,
          offer_price: p.offer_price
        }).eq('id', p.id);
      }
    }

    return res.json({ success: true, updatedCount, discount_percent: disc });
  } catch (err) {
    console.error('Error updating batch discounts:', err);
    return res.status(500).json({ error: 'Failed to update discounts' });
  }
});

module.exports = router;
