const API_BASE = '/api';
const SUPABASE_URL = 'https://quigqqhspdlqgojtqyuc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_32kz1Z7mhuLqxAhyczmsqg_wjGqmIbO';

const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

export const api = {
  // Public Products - Queries Supabase directly with fallback to API
  getProducts: async (params = {}) => {
    try {
      let url = `${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`;
      if (params.category && params.category !== 'all') {
        url += `&category=eq.${encodeURIComponent(params.category)}`;
      }
      if (params.in_stock_only === 'true' || params.in_stock_only === true) {
        url += `&in_stock=eq.true`;
      }
      if (params.search) {
        url += `&name=ilike.*${encodeURIComponent(params.search)}*`;
      }

      const res = await fetch(url, { headers: supabaseHeaders });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Direct Supabase fetch failed, trying /api fallback:', e);
    }

    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products${query ? '?' + query : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API fallback also failed:', e);
    }

    return [];
  },

  getCategories: async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*&order=display_order.asc`, {
        headers: supabaseHeaders
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Direct Supabase categories failed, trying /api fallback:', e);
    }

    try {
      const res = await fetch(`${API_BASE}/products/categories`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return [];
  },

  // Public Orders
  placeOrder: async (orderData) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('POST /api/orders failed, trying direct Supabase insert:', e);
    }

    // 2. Direct Supabase insert fallback
    const payload = {
      order_number: orderData.order_number || `SJC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: orderData.customer_name,
      phone_number: orderData.phone_number,
      whatsapp_number: orderData.whatsapp_number || orderData.phone_number,
      address: orderData.address,
      city: orderData.city,
      pincode: orderData.pincode || '',
      delivery_notes: orderData.delivery_notes || '',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      total_amount: orderData.total_amount || 0,
      payment_method: orderData.payment_method || 'Cash / UPI',
      status: 'Pending'
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        ...supabaseHeaders,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to place order');
    }

    const inserted = await res.json();
    return inserted[0] || payload;
  },

  trackOrders: async (query) => {
    try {
      const res = await fetch(`${API_BASE}/orders/track?query=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    try {
      const clean = query.trim();
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?or=(order_number.ilike.*${encodeURIComponent(clean)}*,phone_number.ilike.*${encodeURIComponent(clean)}*)&order=created_at.desc`,
        { headers: supabaseHeaders }
      );
      if (res.ok) return await res.json();
    } catch (e) {}

    return [];
  },

  // Public Settings
  getSettings: async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*&limit=1`, {
        headers: supabaseHeaders
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]) return data[0];
      }
    } catch (e) {
      console.warn('Direct Supabase settings failed, trying /api fallback:', e);
    }

    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      shop_name: 'SRI JEYAM CRACKERS',
      phone1: '6380115587',
      phone2: '9363243938',
      whatsapp_number: '6380115587',
      offer_title: 'DIWALI SPECIAL OFFER',
      discount_percent: 75,
      tagline: 'Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!',
      min_order_amount: 500
    };
  },

  getStatus: async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      server: 'online',
      database: { connected: true, activeStorage: 'supabase' }
    };
  },

  // Admin Auth
  adminLogin: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid credentials');
    return data;
  },

  checkAdminSession: async (token) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  // Admin Products
  addProduct: async (productData, token) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add product');
    }
    return res.json();
  },

  bulkAddProducts: async (products, token) => {
    const res = await fetch(`${API_BASE}/products/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ products })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to bulk import products');
    }
    return res.json();
  },

  batchUpdateDiscounts: async (category, discount_percent, token) => {
    const res = await fetch(`${API_BASE}/products/batch-discount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ category, discount_percent })
    });
    if (!res.ok) throw new Error('Failed to update batch discounts');
    return res.json();
  },

  updateProduct: async (id, productData, token) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  deleteProduct: async (id, token) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // Admin Image Upload
  uploadImage: async (imageData, filename, token) => {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ image: imageData, filename })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Failed to upload image');
    }
    return res.json();
  },

  // Admin Orders
  getAdminOrders: async (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/orders${query ? '?' + query : ''}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  updateOrderStatus: async (id, status, token) => {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  deleteOrder: async (id, token) => {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
  },

  // Admin Settings
  updateSettings: async (settingsData, token) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settingsData)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  }
};
