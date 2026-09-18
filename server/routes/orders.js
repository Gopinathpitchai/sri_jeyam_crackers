const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { supabase, loadLocalStore, saveLocalStore } = require('../config/supabase');

// Helper to check if Supabase table is usable
async function useSupabaseOrders() {
  try {
    const { error } = await supabase.from('orders').select('id').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
}

// 1. POST create order (Public - NO login required!)
router.post('/', async (req, res) => {
  const {
    customer_name,
    phone_number,
    whatsapp_number,
    address,
    city,
    pincode,
    delivery_notes = '',
    items = []
  } = req.body;

  if (!customer_name || !phone_number || !address || !city) {
    return res.status(400).json({ error: 'Name, phone number, address, and city are required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  // Calculate totals
  let subtotal = 0;
  let total_amount = 0;

  const sanitizedItems = items.map(item => {
    const qty = parseInt(item.quantity) || 1;
    const origPrice = parseFloat(item.original_price || item.price || 0);
    const offerPrice = parseFloat(item.offer_price || origPrice * 0.5);
    const itemTotal = offerPrice * qty;

    subtotal += origPrice * qty;
    total_amount += itemTotal;

    return {
      product_id: item.id || item.product_id,
      name: item.name,
      category: item.category || 'General',
      pack_size: item.pack_size || '1 Box',
      original_price: origPrice,
      offer_price: offerPrice,
      quantity: qty,
      total: itemTotal
    };
  });

  const discount = Math.max(0, subtotal - total_amount);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const order_number = req.body.order_number || `SJC-${new Date().getFullYear()}-${randomSuffix}`;

  const newOrder = {
    id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    order_number,
    customer_name: customer_name.trim(),
    phone_number: phone_number.trim(),
    whatsapp_number: (whatsapp_number || phone_number).trim(),
    address: address.trim(),
    city: city.trim(),
    pincode: (pincode || '').trim(),
    delivery_notes: delivery_notes || '',
    items: sanitizedItems,
    subtotal: Math.round(subtotal),
    discount: Math.round(discount),
    total_amount: Math.round(total_amount),
    payment_method: req.body.payment_method || 'Cash / UPI',
    status: req.body.status || 'Pending',
    created_at: new Date().toISOString()
  };

  try {
    const hasSupabase = await useSupabaseOrders();
    if (hasSupabase) {
      const { data, error } = await supabase.from('orders').insert([newOrder]).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    const store = loadLocalStore();
    store.orders = store.orders || [];
    store.orders.unshift(newOrder);
    saveLocalStore(store);

    return res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error inserting order to Supabase:', err);
    const store = loadLocalStore();
    store.orders = store.orders || [];
    store.orders.unshift(newOrder);
    saveLocalStore(store);
    return res.status(201).json(newOrder);
  }
});

// 2. GET track order by phone number or order number (Public - NO login required!)
router.get('/track', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Please enter a phone number or order number to track' });
  }

  const cleanQuery = query.trim().toLowerCase();

  try {
    const hasSupabase = await useSupabaseOrders();
    if (hasSupabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`phone_number.ilike.%${cleanQuery}%,order_number.ilike.%${cleanQuery}%,whatsapp_number.ilike.%${cleanQuery}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json(data || []);
    }

    const store = loadLocalStore();
    const matches = (store.orders || []).filter(o => 
      o.phone_number.includes(cleanQuery) || 
      (o.order_number && o.order_number.toLowerCase().includes(cleanQuery)) ||
      (o.whatsapp_number && o.whatsapp_number.includes(cleanQuery))
    );
    return res.json(matches);
  } catch (err) {
    console.error('Error tracking orders:', err);
    const store = loadLocalStore();
    const matches = (store.orders || []).filter(o => 
      o.phone_number.includes(cleanQuery) || 
      (o.order_number && o.order_number.toLowerCase().includes(cleanQuery))
    );
    return res.json(matches);
  }
});

// 3. GET all orders (Admin only)
router.get('/', requireAdmin, async (req, res) => {
  const { status, search } = req.query;

  try {
    const hasSupabase = await useSupabaseOrders();
    if (hasSupabase) {
      let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') {
        q = q.eq('status', status);
      }
      if (search) {
        q = q.or(`customer_name.ilike.%${search}%,phone_number.ilike.%${search}%,order_number.ilike.%${search}%`);
      }
      const { data, error } = await q;
      if (error) throw error;
      return res.json(data || []);
    }

    const store = loadLocalStore();
    let list = store.orders || [];

    if (status && status !== 'all') {
      list = list.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o => 
        o.customer_name.toLowerCase().includes(q) || 
        o.phone_number.includes(q) || 
        (o.order_number && o.order_number.toLowerCase().includes(q))
      );
    }
    return res.json(list);
  } catch (err) {
    console.error('Error getting admin orders:', err);
    const store = loadLocalStore();
    return res.json(store.orders || []);
  }
});

// 4. PATCH update order status (Admin only)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const hasSupabase = await useSupabaseOrders();
    if (hasSupabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    }

    const store = loadLocalStore();
    const index = (store.orders || []).findIndex(o => o.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    store.orders[index].status = status;
    store.orders[index].updated_at = new Date().toISOString();
    saveLocalStore(store);

    return res.json(store.orders[index]);
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

// 5. DELETE order (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const hasSupabase = await useSupabaseOrders();
    if (hasSupabase) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Order deleted' });
    }

    const store = loadLocalStore();
    store.orders = (store.orders || []).filter(o => o.id !== id);
    saveLocalStore(store);
    return res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    console.error('Error deleting order:', err);
    return res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
