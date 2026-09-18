const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { supabase, loadLocalStore, saveLocalStore } = require('../config/supabase');

// Helper to check if Supabase site_settings table is usable
async function useSupabaseSettings() {
  try {
    const { error } = await supabase.from('site_settings').select('id').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
}

// 1. GET site settings (Public)
router.get('/', async (req, res) => {
  try {
    const hasSupabase = await useSupabaseSettings();
    if (hasSupabase) {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'default').single();
      if (!error && data) {
        return res.json(data);
      }
    }

    const store = loadLocalStore();
    return res.json(store.site_settings || {
      shop_name: 'SRI JEYAM CRACKERS',
      phone1: '6380115587',
      phone2: '9363243938',
      whatsapp_number: '6380115587',
      offer_title: 'DIWALI SPECIAL OFFER',
      discount_percent: 50,
      tagline: 'Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!',
      min_order_amount: 500
    });
  } catch (err) {
    const store = loadLocalStore();
    return res.json(store.site_settings);
  }
});

// 2. PUT update site settings (Admin only)
router.put('/', requireAdmin, async (req, res) => {
  const updates = req.body;

  try {
    const hasSupabase = await useSupabaseSettings();
    if (hasSupabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ id: 'default', ...updates, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    }

    const store = loadLocalStore();
    store.site_settings = { ...(store.site_settings || {}), ...updates };
    saveLocalStore(store);
    return res.json(store.site_settings);
  } catch (err) {
    console.error('Error saving settings:', err);
    const store = loadLocalStore();
    store.site_settings = { ...(store.site_settings || {}), ...updates };
    saveLocalStore(store);
    return res.json(store.site_settings);
  }
});

module.exports = router;
