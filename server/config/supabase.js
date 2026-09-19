const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const WebSocket = require('ws');
if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocket;
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://quigqqhspdlqgojtqyuc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_32kz1Z7mhuLqxAhyczmsqg_wjGqmIbO';

// Create Supabase Client with secret key for full admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Direct PostgreSQL Connection Pool for sub-100ms bulk database updates
let pgPool = null;
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require('pg');
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  } catch (err) {
    console.warn('Could not initialize PG pool:', err.message);
  }
}

async function queryDatabase(text, params = []) {
  if (pgPool) {
    return await pgPool.query(text, params);
  }
  return null;
}

// Resilient Local Store file path (safe for both local server and Vercel serverless)
const DATA_FILE = path.join(__dirname, '..', 'data', 'store.json');

// Initialize local store structure (strictly NO dummy cracker products!)
function getInitialStore() {
  return {
    categories: [
      { id: 'cat-1', name: 'Single Sound Crackers', slug: 'single-sound', display_order: 1 },
      { id: 'cat-2', name: 'Sparklers (Kambi)', slug: 'sparklers', display_order: 2 },
      { id: 'cat-3', name: 'Flower Pots (Anar)', slug: 'flower-pots', display_order: 3 },
      { id: 'cat-4', name: 'Ground Chakkars', slug: 'ground-chakkars', display_order: 4 },
      { id: 'cat-5', name: 'Rockets & Missiles', slug: 'rockets', display_order: 5 },
      { id: 'cat-6', name: 'Sky Shots & Aerial Fancys', slug: 'sky-shots', display_order: 6 },
      { id: 'cat-7', name: 'Bijili & Garlands (Walas)', slug: 'garlands', display_order: 7 },
      { id: 'cat-8', name: 'Kids Novelty Crackers', slug: 'kids-novelty', display_order: 8 },
      { id: 'cat-9', name: 'Diwali Family Gift Boxes', slug: 'gift-boxes', display_order: 9 },
    ],
    products: [], // Strictly EMPTY as requested: "dont add the dummy data later i will give me data"
    orders: [],
    site_settings: {
      id: 'default',
      shop_name: 'SRI JEYAM CRACKERS',
      phone1: '6380115587',
      phone2: '9363243938',
      whatsapp_number: '6380115587',
      offer_title: 'DIWALI SPECIAL OFFER',
      discount_percent: 50,
      tagline: 'Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!',
      min_order_amount: 500
    }
  };
}

// Statically require store.json so Vercel's bundler bundles it into the serverless deployment
let staticStore = null;
try {
  staticStore = require('../data/store.json');
} catch (e) {
  staticStore = null;
}

function loadLocalStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read local store file, using in-memory store:', err.message);
  }
  if (staticStore) {
    return JSON.parse(JSON.stringify(staticStore));
  }
  return getInitialStore();
}

function saveLocalStore(store) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.warn('Could not persist to local store (read-only filesystem):', err.message);
  }
}

// Check Supabase Table Existence
async function checkSupabaseStatus() {
  const status = {
    connected: false,
    url: SUPABASE_URL,
    tables: {
      products: false,
      orders: false,
      categories: false,
      site_settings: false
    },
    activeStorage: 'local_fallback',
    error: null
  };

  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (!error) {
      status.connected = true;
      status.tables.products = true;
    } else {
      status.error = error.message;
    }

    const { error: ordErr } = await supabase.from('orders').select('id').limit(1);
    if (!ordErr) status.tables.orders = true;

    const { error: catErr } = await supabase.from('categories').select('id').limit(1);
    if (!catErr) status.tables.categories = true;

    const { error: setErr } = await supabase.from('site_settings').select('id').limit(1);
    if (!setErr) status.tables.site_settings = true;

    if (status.tables.products && status.tables.orders) {
      status.activeStorage = 'supabase';
      status.connected = true;
    }
  } catch (e) {
    status.error = e.message;
  }

  return status;
}

module.exports = {
  supabase,
  pgPool,
  queryDatabase,
  loadLocalStore,
  saveLocalStore,
  checkSupabaseStatus
};
