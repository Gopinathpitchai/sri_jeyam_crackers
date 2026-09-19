import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, DollarSign, Plus, Trash2, Edit2, CheckCircle2, 
  Clock, Database, Settings, LogOut, ExternalLink, MessageSquare, Copy, 
  Check, RefreshCw, Layers, Search, Filter, Percent, ArrowLeft, Building2, 
  Smartphone, Printer, FileText, Image as ImageIcon, Upload
} from 'lucide-react';
import { api } from '../utils/api';
import BillInvoiceModal from '../components/BillInvoiceModal';

export default function AdminDashboard({ token, user, onLogout, onBackToSite }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'database', 'settings'
  
  // Bill Generator Modal States
  const [showBillModal, setShowBillModal] = useState(false);
  const [activeBillOrder, setActiveBillOrder] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewingBigImage, setViewingBigImage] = useState(null);
  
  // Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Product Filter & Search
  const [searchProd, setSearchProd] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modals
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Batch Discount
  const [batchCategory, setBatchCategory] = useState('all');
  const [batchDiscount, setBatchDiscount] = useState('75');
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

  // Single Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Sparklers',
    original_price: '',
    discount_percent: 75,
    offer_price: '',
    pack_size: 'Box',
    description: '',
    image_url: '',
    in_stock: true
  });

  // Bulk Product Paste Form
  const [bulkInput, setBulkInput] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordData, prodData, catData, settsData, statusData] = await Promise.all([
        api.getAdminOrders(token).catch(() => []),
        api.getProducts().catch(() => []),
        api.getCategories().catch(() => []),
        api.getSettings().catch(() => null),
        api.getStatus().catch(() => null)
      ]);

      setOrders(ordData || []);
      setProducts(prodData || []);
      setCategories(catData || []);
      setSettings(settsData);
      setDbStatus(statusData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // 1. Order Status Update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, token);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showNotification(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.deleteOrder(orderId, token);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      showNotification('Order deleted');
    } catch (err) {
      alert(err.message || 'Failed to delete order');
    }
  };

  const openWhatsAppCustomer = (order) => {
    const phone = order.whatsapp_number || order.phone_number;
    let msg = `Hello ${order.customer_name}! 🎆\nYour Sri Jeyam Crackers order *${order.order_number}* is currently: *${order.status}*.\nTotal: ₹${order.total_amount}.\nThank you for choosing Sri Jeyam Crackers!`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Image Upload Handler (from Device or Camera)
  const handleImageFileUpload = async (file, isEdit = true) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        try {
          const res = await api.uploadImage(base64, file.name, token);
          const imgUrl = res.url || base64;
          if (isEdit) {
            setEditingProduct(prev => ({ ...prev, image_url: imgUrl }));
          } else {
            setProductForm(prev => ({ ...prev, image_url: imgUrl }));
          }
          showNotification('Picture uploaded successfully!');
        } catch (uploadErr) {
          console.warn('Upload API fallback to direct base64:', uploadErr);
          if (isEdit) {
            setEditingProduct(prev => ({ ...prev, image_url: base64 }));
          } else {
            setProductForm(prev => ({ ...prev, image_url: base64 }));
          }
          showNotification('Picture loaded!');
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingImage(false);
      alert('Failed to read image file');
    }
  };

  // Direct Bill Save as Order
  const handleSaveDirectBill = async (orderData) => {
    try {
      const res = await api.placeOrder(orderData);
      setOrders(prev => [res?.id ? res : (res?.order || { ...orderData, id: 'ord-' + Date.now(), created_at: new Date().toISOString() }), ...prev]);
      setShowBillModal(false);
      showNotification(`Bill saved as Order ${orderData.order_number}!`);
    } catch (err) {
      alert(err.message || 'Failed to save bill as order');
    }
  };

  // 2. Add Single Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.original_price) return;

    try {
      const orig = parseFloat(productForm.original_price);
      const disc = parseInt(productForm.discount_percent) || 75;
      const offer = productForm.offer_price ? parseFloat(productForm.offer_price) : Math.round(orig * (1 - disc / 100));

      const newProd = await api.addProduct({
        ...productForm,
        original_price: orig,
        offer_price: offer,
        discount_percent: disc
      }, token);

      setProducts(prev => [newProd, ...prev]);
      setShowAddProduct(false);
      setProductForm({
        name: '',
        category: 'Sparklers',
        original_price: '',
        discount_percent: 75,
        offer_price: '',
        pack_size: 'Box',
        description: '',
        image_url: '',
        in_stock: true
      });
      showNotification(`Product "${newProd.name}" added successfully!`);
    } catch (err) {
      alert(err.message || 'Failed to add product');
    }
  };

  // 3. Edit Existing Product (Amount & Discount)
  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const orig = parseFloat(editingProduct.original_price);
      const disc = parseInt(editingProduct.discount_percent) || 0;
      const offer = editingProduct.offer_price !== undefined 
        ? parseFloat(editingProduct.offer_price) 
        : Math.round(orig * (1 - disc / 100));

      const updated = await api.updateProduct(editingProduct.id, {
        ...editingProduct,
        original_price: orig,
        discount_percent: disc,
        offer_price: offer
      }, token);

      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      setEditingProduct(null);
      showNotification(`Product "${updated.name}" updated! Price: ₹${orig}, Discount: ${disc}%, Net: ₹${offer}`);
    } catch (err) {
      alert(err.message || 'Failed to update product');
    }
  };

  // 4. Batch Discount Update
  const handleApplyBatchDiscount = async () => {
    const disc = parseInt(batchDiscount);
    if (isNaN(disc) || disc < 0 || disc > 100) {
      alert('Please enter a valid discount between 0 and 100');
      return;
    }

    if (!window.confirm(`Are you sure you want to apply ${disc}% discount to ${batchCategory === 'all' ? 'ALL products' : batchCategory}?`)) {
      return;
    }

    setIsBatchUpdating(true);
    try {
      await api.batchUpdateDiscounts(batchCategory, disc, token);
      setProducts(prev => prev.map(p => {
        const matches = batchCategory === 'all' || (p.category && p.category.toLowerCase() === batchCategory.toLowerCase());
        if (matches) {
          const orig = parseFloat(p.original_price || 0);
          return {
            ...p,
            discount_percent: disc,
            offer_price: Math.round(orig * (1 - disc / 100))
          };
        }
        return p;
      }));

      // Refresh products from API to ensure complete sync
      const freshProds = await api.getProducts().catch(() => null);
      if (freshProds && freshProds.length > 0) {
        setProducts(freshProds);
      }

      if (batchCategory === 'all') {
        setSettings(prev => prev ? { ...prev, discount_percent: disc } : prev);
        setProductForm(prev => ({ ...prev, discount_percent: disc }));
      }

      showNotification(`🎉 Successfully updated discounts to ${disc}%! All cracker prices updated.`);
    } catch (err) {
      alert(err.message || 'Failed to update batch discount');
    } finally {
      setIsBatchUpdating(false);
    }
  };

  // 5. Bulk Add Products
  const handleBulkAdd = async (e) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;

    const lines = bulkInput.trim().split('\n');
    const parsed = [];

    lines.forEach(line => {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 3) {
        const name = parts[0];
        const category = parts[1];
        const origPrice = parseFloat(parts[2]);
        const packSize = parts[3] || 'Box';
        const disc = 75;
        const offer = Math.round(origPrice * 0.25);

        if (name && !isNaN(origPrice)) {
          parsed.push({
            name,
            category,
            original_price: origPrice,
            offer_price: offer,
            discount_percent: disc,
            pack_size: packSize,
            in_stock: true
          });
        }
      }
    });

    if (parsed.length === 0) {
      alert('Could not parse products. Format: Name, Category, MRP_Price, Pack_Size');
      return;
    }

    try {
      const res = await api.bulkAddProducts(parsed, token);
      setProducts(prev => [...(res.products || parsed), ...prev]);
      setShowBulkAdd(false);
      setBulkInput('');
      showNotification(`Successfully imported ${parsed.length} products!`);
    } catch (err) {
      alert(err.message || 'Bulk import failed');
    }
  };

  // 6. Toggle Stock
  const handleToggleStock = async (product) => {
    try {
      await api.updateProduct(product.id, { in_stock: !product.in_stock }, token);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, in_stock: !product.in_stock } : p));
      showNotification(`Product marked as ${!product.in_stock ? 'In Stock' : 'Out of Stock'}`);
    } catch (err) {
      alert(err.message || 'Failed to update stock status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(productId, token);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showNotification('Product deleted');
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch = !searchProd || 
      p.name.toLowerCase().includes(searchProd.toLowerCase()) || 
      p.category.toLowerCase().includes(searchProd.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-midnight-900 border-b border-festive-gold/30 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl diya-glow">🪔</span>
          <div>
            <div className="text-lg font-black font-poster text-gold-gradient">
              SRI JEYAM CRACKERS
            </div>
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              Admin Portal • Manage Rates & Discounts
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveBillOrder(null);
              setShowBillModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md"
            title="Create & Print Bill / Invoice"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Bill (பில் போடுதல்)</span>
          </button>
          <button
            onClick={onBackToSite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront View</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold transition-all border border-red-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Success Toast */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-midnight-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Catalog Items</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">{products.length}</div>
          </div>

          <div className="bg-midnight-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Orders</span>
              <ShoppingCart className="w-4 h-4 text-festive-yellow" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{orders.length}</div>
          </div>

          <div className="bg-midnight-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Pending Orders</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">{pendingOrders}</div>
          </div>

          <div className="bg-midnight-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">₹{Math.round(totalRevenue)}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-festive-red text-white shadow-md border border-festive-gold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Rates ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-festive-red text-white shadow-md border border-festive-gold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'bg-festive-red text-white shadow-md border border-festive-gold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database & Payment Details</span>
          </button>

          <button
            onClick={() => {
              setActiveBillOrder(null);
              setShowBillModal(true);
            }}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 text-amber-300 hover:text-white hover:bg-amber-950/40 border border-amber-500/30"
            title="Counter Billing / Quick POS Bill"
          >
            <FileText className="w-4 h-4" />
            <span>Quick Billing (புதிய பில்)</span>
          </button>

          <button
            onClick={fetchData}
            className="ml-auto p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: PRODUCTS & RATES */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="bg-midnight-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Crackers Price & Discount Manager</h3>
                  <p className="text-xs text-slate-400">
                    Showing {filteredProducts.length} of {products.length} products. Click the edit icon on any item to change Actual Rate, Discount %, or Net Rate.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBulkAdd(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Bulk Rapid Add</span>
                  </button>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="px-3 py-1.5 rounded-xl bg-festive-red hover:bg-festive-red-light text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Cracker</span>
                  </button>
                </div>
              </div>

              {/* Quick Batch Discount Modifier Bar */}
              <div className="p-3 bg-midnight-950 rounded-xl border border-festive-gold/20 flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Percent className="w-4 h-4" />
                  <span>Batch Discount Tool:</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">For:</span>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Set Discount:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={batchDiscount}
                    onChange={(e) => setBatchDiscount(e.target.value)}
                    className="w-16 p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs text-center font-bold"
                  />
                  <span className="text-slate-300 font-bold">%</span>
                </div>

                <button
                  onClick={handleApplyBatchDiscount}
                  disabled={isBatchUpdating}
                  className={`px-3 py-1.5 rounded-lg text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 ${
                    isBatchUpdating 
                      ? 'bg-amber-800 cursor-not-allowed opacity-80' 
                      : 'bg-amber-600 hover:bg-amber-500 active:scale-95'
                  }`}
                >
                  {isBatchUpdating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying {batchDiscount}%...</span>
                    </>
                  ) : (
                    <span>Apply to Category</span>
                  )}
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by product name or category..."
                    value={searchProd}
                    onChange={(e) => setSearchProd(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-midnight-950 border border-slate-700 text-white text-xs outline-none focus:border-festive-gold"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="py-2 px-3 rounded-xl bg-midnight-950 border border-slate-700 text-white text-xs outline-none focus:border-festive-gold"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map(c => (
                      <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-midnight-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-midnight-950 text-slate-400 uppercase font-bold border-b border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">S.No</th>
                      <th className="p-3 text-center">Picture</th>
                      <th className="p-3">Product / பொருள் பெயர்</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Packing</th>
                      <th className="p-3">Actual Rate (MRP)</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3 text-festive-yellow">Net Rate (Payable)</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Quick Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((prod, idx) => (
                      <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="p-3 text-center">
                          {prod.image_url ? (
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-lg border border-festive-gold/40 shadow cursor-pointer hover:scale-125 transition-transform mx-auto"
                              onClick={() => setViewingBigImage(prod)}
                              title="Click to view picture in big size"
                              onError={(e) => { e.target.onerror = null; e.target.src = '/images/sparklers.jpg'; }}
                            />
                          ) : (
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white text-[10px] font-semibold border border-slate-700 flex items-center gap-1 mx-auto transition-colors"
                              title="Add product picture"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>+ Pic</span>
                            </button>
                          )}
                        </td>
                        <td className="p-3 font-bold text-white max-w-xs">{prod.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-amber-300 whitespace-nowrap">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{prod.pack_size || 'Box'}</td>
                        <td className="p-3 line-through text-slate-500 font-mono">
                          ₹{prod.original_price}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 font-bold border border-red-800/50">
                            {prod.discount_percent || 75}% OFF
                          </span>
                        </td>
                        <td className="p-3 font-black text-sm text-festive-gold font-mono">
                          ₹{prod.offer_price}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleStock(prod)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                              prod.in_stock
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-red-500/20 text-red-300 border-red-500/40'
                            }`}
                          >
                            {prod.in_stock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 rounded bg-festive-red/20 text-festive-yellow hover:bg-festive-red hover:text-white transition-colors border border-festive-red/40"
                              title="Change Amount & Discount"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Customer Orders</h3>
              <span className="text-xs text-slate-400">{orders.length} total orders received</span>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-4 shadow-lg"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black font-mono text-festive-gold">
                            {ord.order_number}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({new Date(ord.created_at).toLocaleString()})
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white mt-1">
                          {ord.customer_name} • <span className="font-mono text-amber-300">{ord.phone_number}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {ord.address}, {ord.city} {ord.pincode ? `- ${ord.pincode}` : ''}
                        </div>
                      </div>

                      {/* Status Selector & WhatsApp */}
                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-midnight-950 border border-slate-700 text-xs font-bold text-festive-yellow focus:border-festive-gold outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => {
                            setActiveBillOrder(ord);
                            setShowBillModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow transition-colors"
                          title="Generate & Print Official Bill / Tax Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Generate Bill</span>
                        </button>

                        <button
                          onClick={() => openWhatsAppCustomer(ord)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                          title="Message Customer on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-midnight-950 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                      <div className="font-bold text-slate-300 mb-2">Items Ordered:</div>
                      {(ord.items || []).map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300">
                          <span>
                            {it.name} ({it.pack_size || 'Box'}) x {it.quantity}
                          </span>
                          <span className="font-mono text-slate-400">
                            ₹{it.total || (it.offer_price * it.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                        <span>Total Payable:</span>
                        <span className="text-festive-gold font-mono">₹{ord.total_amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-midnight-900 rounded-2xl border border-slate-800 text-slate-400 text-sm">
                No orders received yet. Once customers place orders from the storefront or WhatsApp, they will show up here.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DATABASE & PAYMENT DETAILS */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Shop Payment Information */}
            <div className="p-5 bg-midnight-900 rounded-2xl border border-festive-gold/40 space-y-4">
              <div className="flex items-center gap-2 text-festive-yellow font-bold text-sm">
                <Smartphone className="w-5 h-5" />
                <span>Shop UPI & Digital Payment Details</span>
              </div>
              
              <div className="max-w-md text-xs">
                <div className="bg-midnight-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-emerald-400 font-bold text-sm">📱 GPay / PhonePe / Paytm</div>
                  <div className="space-y-1 text-slate-300">
                    <div>UPI / Mobile Number: <strong className="text-white font-mono">63801 15587</strong></div>
                    <div>UPI Name: <strong className="text-white">Sri Jeyam Crackers</strong></div>
                    <div>UPI ID: <strong className="text-white font-mono">6380115587@upi</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supabase Status */}
            <div className="p-5 bg-midnight-900 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-5 h-5 text-festive-gold" />
                  <h3 className="text-base font-bold text-white">Supabase Cloud Database Status</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Online
                </span>
              </div>

              <div className="bg-midnight-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Supabase URL:</span>
                  <span className="font-mono text-slate-200">https://quigqqhspdlqgojtqyuc.supabase.co</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Storage:</span>
                  <span className="font-bold text-amber-300 uppercase font-mono">
                    {dbStatus?.database?.activeStorage === 'supabase' ? 'Supabase Database' : 'Fast Local Store Fallback'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: EDIT PRODUCT (AMOUNT & DISCOUNT) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-midnight-950 border-2 border-festive-gold rounded-3xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-black font-poster text-white mb-1">
              Change Rate & Discount
            </h3>
            <p className="text-xs text-amber-300 font-bold mb-4">
              {editingProduct.name}
            </p>

            <form onSubmit={handleSaveEditProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-lg bg-midnight-900 border border-slate-700 text-white outline-none focus:border-festive-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-midnight-900 border border-slate-700 text-white outline-none focus:border-festive-gold"
                  >
                    {categories.map(c => (
                      <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Packing / Content</label>
                  <input
                    type="text"
                    value={editingProduct.pack_size || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pack_size: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-midnight-900 border border-slate-700 text-white outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              {/* Price & Discount Controls */}
              <div className="p-4 bg-midnight-900 rounded-2xl border border-festive-gold/30 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Actual Rate / அசல் விலை (MRP ₹) *
                    </label>
                    <input
                      type="number"
                      value={editingProduct.original_price}
                      onChange={(e) => {
                        const orig = parseFloat(e.target.value) || 0;
                        const disc = parseInt(editingProduct.discount_percent) || 0;
                        const calcOffer = Math.round(orig * (1 - disc / 100));
                        setEditingProduct({
                          ...editingProduct,
                          original_price: e.target.value,
                          offer_price: calcOffer
                        });
                      }}
                      required
                      className="w-full p-2.5 rounded-lg bg-midnight-950 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-festive-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Discount / தள்ளுபடி (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingProduct.discount_percent}
                      onChange={(e) => {
                        const disc = parseInt(e.target.value) || 0;
                        const orig = parseFloat(editingProduct.original_price) || 0;
                        const calcOffer = Math.round(orig * (1 - disc / 100));
                        setEditingProduct({
                          ...editingProduct,
                          discount_percent: e.target.value,
                          offer_price: calcOffer
                        });
                      }}
                      required
                      className="w-full p-2.5 rounded-lg bg-midnight-950 border border-slate-700 text-white font-mono font-bold text-sm outline-none focus:border-festive-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-festive-yellow font-bold mb-1">
                    Net Rate / நிகர விலை (Final Offer Price ₹) *
                  </label>
                  <input
                    type="number"
                    value={editingProduct.offer_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, offer_price: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-lg bg-midnight-950 border-2 border-festive-gold text-festive-gold font-mono font-black text-base outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Calculated automatically from Actual Rate and Discount %, or you can type a custom Net Rate directly.
                  </span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingProduct.in_stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.checked })}
                    className="w-4 h-4 rounded text-festive-red bg-slate-900 border-slate-700"
                  />
                  <span>Mark as In Stock</span>
                </label>
              </div>

              {/* Product Picture Management */}
              <div className="p-4 bg-midnight-900 rounded-2xl border border-festive-gold/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4" />
                    <span>Product Picture / படம் சேர்க்க</span>
                  </label>
                  {editingProduct.image_url && (
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, image_url: '' })}
                      className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Picture</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-24 h-24 rounded-xl bg-midnight-950 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                    {editingProduct.image_url ? (
                      <img
                        src={editingProduct.image_url}
                        alt={editingProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/sparklers.jpg'; }}
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-500 text-[10px]">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span>No Picture</span>
                      </div>
                    )}
                  </div>

                  {/* Upload & Link Controls */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                        Upload Photo from Computer / Mobile
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-300" />
                        <span>{uploadingImage ? 'Uploading...' : 'Choose Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageFileUpload(e.target.files[0], true);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">
                        Or Enter Image URL / Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg or /images/..."
                        value={editingProduct.image_url || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                        className="w-full p-2 rounded-lg bg-midnight-950 border border-slate-700 text-white text-xs outline-none focus:border-festive-gold font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Category Presets */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">
                    Or Choose from Fireworks Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Sparklers', url: '/images/sparklers.jpg' },
                      { label: 'Flower Pots', url: '/images/flower_pots.jpg' },
                      { label: 'Chakkars', url: '/images/chakkars.jpg' },
                      { label: 'Bombs', url: '/images/bombs.jpg' },
                      { label: 'Rockets', url: '/images/rockets.jpg' },
                      { label: 'Repeating Shots', url: '/images/repeating_shots.jpg' }
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, image_url: preset.url })}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                          editingProduct.image_url === preset.url
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-festive-red to-festive-red-light hover:brightness-110 text-white font-bold shadow-lg"
                >
                  Save Rate & Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SINGLE PRODUCT */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-midnight-950 border border-festive-gold/40 rounded-3xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-black font-poster text-white mb-4">Add New Cracker Item</h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. 7 CM Electric Sparklers"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-lg bg-midnight-900 border border-slate-700 text-white outline-none focus:border-festive-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-midnight-900 border border-slate-700 text-white outline-none focus:border-festive-gold"
                  >
                    {categories.map(c => (
                      <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pack Size</label>
                  <input
                    type="text"
                    placeholder="e.g. Box / Pkt"
                    value={productForm.pack_size}
                    onChange={(e) => setProductForm({ ...productForm, pack_size: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-midnight-900 border border-slate-700 text-white outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Actual Rate (MRP ₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={productForm.original_price}
                    onChange={(e) => {
                      const orig = parseFloat(e.target.value) || 0;
                      const disc = parseInt(productForm.discount_percent) || 0;
                      setProductForm({
                        ...productForm,
                        original_price: e.target.value,
                        offer_price: Math.round(orig * (1 - disc / 100))
                      });
                    }}
                    required
                    className="w-full p-2.5 rounded-lg bg-midnight-900 border border-slate-700 text-white outline-none focus:border-festive-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount %</label>
                  <input
                    type="number"
                    value={productForm.discount_percent}
                    onChange={(e) => {
                      const disc = parseInt(e.target.value) || 0;
                      const orig = parseFloat(productForm.original_price) || 0;
                      setProductForm({
                        ...productForm,
                        discount_percent: e.target.value,
                        offer_price: Math.round(orig * (1 - disc / 100))
                      });
                    }}
                    className="w-full p-2.5 rounded-lg bg-midnight-900 border border-slate-700 text-white outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              {/* Product Picture Management for New Product */}
              <div className="p-3 bg-midnight-900 rounded-xl border border-slate-700 space-y-2">
                <label className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Product Picture (Optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-midnight-950 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {productForm.image_url ? (
                      <img src={productForm.image_url} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
                      <Upload className="w-3 h-3 text-amber-300" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleImageFileUpload(e.target.files[0], false);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                      className="w-full p-1.5 rounded bg-midnight-950 border border-slate-700 text-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-festive-red hover:bg-festive-red-light text-white font-bold"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BULK RAPID ADD */}
      {showBulkAdd && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-midnight-950 border border-festive-gold/40 rounded-3xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-black font-poster text-white mb-2">
              Bulk Rapid Product Import
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste multiple cracker products, one per line. Format: <code className="text-amber-300">Name, Category, MRP_Price, Pack_Size</code>
            </p>

            <form onSubmit={handleBulkAdd} className="space-y-3">
              <textarea
                rows="8"
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="7 CM Electric Sparklers, Sparklers, 32, Box&#10;Flower Pots Big, Flower Pots, 320, Box&#10;Ground Chakkar Big, Chakkars, 160, Box"
                className="w-full p-3 rounded-xl bg-midnight-900 border border-slate-700 text-white font-mono text-xs outline-none focus:border-festive-gold resize-none"
              ></textarea>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkAdd(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-md"
                >
                  Import Products (75% Discount Applied)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BILL INVOICE GENERATOR */}
      {showBillModal && (
        <BillInvoiceModal
          order={activeBillOrder}
          products={products}
          onClose={() => {
            setShowBillModal(false);
            setActiveBillOrder(null);
          }}
          onSaveOrder={handleSaveDirectBill}
        />
      )}

      {/* MODAL: BIG IMAGE PREVIEW */}
      {viewingBigImage && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setViewingBigImage(null)}
        >
          <div
            className="relative max-w-lg w-full bg-midnight-950 border-2 border-festive-gold rounded-3xl p-5 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingBigImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-white hover:bg-festive-red transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={viewingBigImage.image_url}
              alt={viewingBigImage.name}
              className="w-full max-h-[65vh] object-contain rounded-2xl mb-3 shadow-xl"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/sparklers.jpg'; }}
            />
            <h3 className="text-base font-black text-white">{viewingBigImage.name}</h3>
            <p className="text-xs text-amber-300 font-mono mt-1">
              Packing: {viewingBigImage.pack_size || 'Box'} • MRP: ₹{viewingBigImage.original_price} • Net Rate: ₹{viewingBigImage.offer_price} ({viewingBigImage.discount_percent || 75}% OFF)
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => {
                  setEditingProduct(viewingBigImage);
                  setViewingBigImage(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-festive-red hover:bg-festive-red-light text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Product & Picture</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
