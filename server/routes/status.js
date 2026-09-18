const express = require('express');
const router = express.Router();
const { checkSupabaseStatus, loadLocalStore } = require('../config/supabase');

router.get('/', async (req, res) => {
  const supaStatus = await checkSupabaseStatus();
  const localStore = loadLocalStore();

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: supaStatus,
    localFallback: {
      active: supaStatus.activeStorage === 'local_fallback',
      productCount: (localStore.products || []).length,
      orderCount: (localStore.orders || []).length
    }
  });
});

module.exports = router;
