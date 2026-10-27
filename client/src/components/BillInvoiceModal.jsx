import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, MessageSquare, X, Plus, Trash2, Check, Download, 
  Smartphone, Phone, Calendar, User, MapPin, Hash, Sparkles, AlertCircle, Percent,
  Search, Filter, Package, Tag, ArrowRight, RotateCcw, CheckCircle2, ShoppingBag, Edit3
} from 'lucide-react';
import { api } from '../utils/api';

function numberToWords(num) {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  };

  const rounded = Math.round(num);
  return 'Rupees ' + inWords(rounded) + ' Only';
}

function parseOrderItems(order) {
  if (!order || !order.items) return [];
  let raw = order.items;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch (e) {
      raw = [];
    }
  }
  if (!Array.isArray(raw)) return [];

  return raw.map(it => {
    const orig = parseFloat(it.original_price || it.price || (it.offer_price ? it.offer_price * 4 : 0));
    const disc = it.discount_percent !== undefined ? it.discount_percent : 83;
    const offer = parseFloat(it.offer_price !== undefined ? it.offer_price : (orig ? Math.round(orig * (1 - disc / 100)) : 0));
    const qty = parseInt(it.quantity) || 1;
    return {
      id: it.id || it.product_id || ('item-' + Math.random().toString(36).substr(2, 9)),
      name: it.name || it.product_name || 'Cracker Item',
      category: it.category || 'General',
      pack_size: it.pack_size || 'Box',
      original_price: orig,
      discount_percent: disc,
      offer_price: offer,
      quantity: qty,
      total: it.total !== undefined ? parseFloat(it.total) : (offer * qty),
      is_custom: it.is_custom || false
    };
  });
}

export default function BillInvoiceModal({ 
  order = null, 
  products = [], 
  onClose, 
  onSaveOrder 
}) {
  const [invoiceNumber, setInvoiceNumber] = useState(() => {
    if (order?.order_number) return order.order_number;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `SJC-${new Date().getFullYear()}-${randomNum}`;
  });

  const [invoiceDate, setInvoiceDate] = useState(() => {
    if (order?.created_at) {
      return new Date(order.created_at).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });

  const [customerName, setCustomerName] = useState(order?.customer_name || '');
  const [customerPhone, setCustomerPhone] = useState(order?.phone_number || order?.whatsapp_number || order?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(order?.address || '');
  const [customerCity, setCustomerCity] = useState(order?.city || 'Tamil Nadu');
  const [paymentMode, setPaymentMode] = useState(order?.payment_method || 'Cash / Online');
  const [packagingCharge, setPackagingCharge] = useState(order?.packaging_charge || 0);
  const [deliveryCharge, setDeliveryCharge] = useState(order?.delivery_charge || 0);
  const [items, setItems] = useState(() => parseOrderItems(order));
  const [billDiscount, setBillDiscount] = useState(() => {
    if (order?.discount_percent) return order.discount_percent;
    const initialItems = parseOrderItems(order);
    if (initialItems.length > 0 && initialItems[0].discount_percent !== undefined) {
      return initialItems[0].discount_percent;
    }
    return 83;
  });

  // Ensure catalog products are always available
  const [catalogProducts, setCatalogProducts] = useState(products || []);
  useEffect(() => {
    if (products && products.length > 0) {
      setCatalogProducts(products);
    } else {
      api.getProducts().then(res => {
        if (Array.isArray(res) && res.length > 0) {
          setCatalogProducts(res);
        }
      }).catch(err => console.warn('Could not load products in Bill modal:', err));
    }
  }, [products]);

  // Unique product categories
  const productCategories = useMemo(() => {
    const set = new Set();
    catalogProducts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [catalogProducts]);

  // Active Add-Item Mode: 'catalog' | 'custom'
  const [addItemMode, setAddItemMode] = useState('catalog');

  // Search & Filter for Catalog Crackers
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addQty, setAddQty] = useState(1);
  const [showSearchResults, setShowSearchResults] = useState(true);

  // Custom / Extra Item Form State
  const [customItem, setCustomItem] = useState({
    name: '',
    pack_size: '1 Box',
    original_price: '',
    discount_percent: 83,
    offer_price: '',
    quantity: 1
  });

  // Filter inside the Bill Items Table
  const [tableSearchQuery, setTableSearchQuery] = useState('');

  // Toast feedback message
  const [toastMsg, setToastMsg] = useState('');
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Sync state whenever order prop changes or modal is re-opened
  useEffect(() => {
    if (order) {
      setInvoiceNumber(order.order_number || `SJC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setInvoiceDate(order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setCustomerName(order.customer_name || '');
      setCustomerPhone(order.phone_number || order.whatsapp_number || order.phone || '');
      setCustomerAddress(order.address || '');
      setCustomerCity(order.city || 'Tamil Nadu');
      setPaymentMode(order.payment_method || 'Cash / Online');
      setPackagingCharge(order.packaging_charge || 0);
      setDeliveryCharge(order.delivery_charge || 0);
      const parsed = parseOrderItems(order);
      setItems(parsed);
      const initDisc = order.discount_percent || (parsed.length > 0 ? parsed[0].discount_percent : 83);
      setBillDiscount(initDisc);
    } else {
      setInvoiceNumber(`SJC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCustomerCity('Tamil Nadu');
      setPaymentMode('Cash / Online');
      setPackagingCharge(0);
      setDeliveryCharge(0);
      setItems([]);
      setBillDiscount(83);
    }
  }, [order]);

  // Keep custom item discount aligned with billDiscount
  useEffect(() => {
    setCustomItem(prev => {
      const disc = parseInt(billDiscount) || 83;
      const orig = parseFloat(prev.original_price || 0);
      const newOffer = orig > 0 ? Math.round(orig * (1 - disc / 100)) : prev.offer_price;
      return {
        ...prev,
        discount_percent: disc,
        offer_price: newOffer !== '' && newOffer !== undefined ? newOffer : ''
      };
    });
  }, [billDiscount]);

  // Filtered products for catalog picker
  const filteredPickerProducts = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    return catalogProducts.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchText = !q || 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.pack_size && p.pack_size.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }, [catalogProducts, searchFilter, selectedCategory]);

  // Apply a new discount percentage to ALL items on this bill
  const handleApplyBillDiscount = (targetDiscount) => {
    const disc = parseInt(targetDiscount);
    if (isNaN(disc) || disc < 0 || disc > 100) return;
    setBillDiscount(disc);
    setItems(prevItems => prevItems.map(it => {
      const orig = parseFloat(it.original_price || 0);
      const newOffer = Math.round(orig * (1 - disc / 100));
      return {
        ...it,
        discount_percent: disc,
        offer_price: newOffer,
        total: newOffer * it.quantity
      };
    }));
    triggerToast(`Applied ${disc}% discount to all ${items.length} items on this bill!`);
  };

  // Modify discount percentage for a single item in the bill
  const handleItemDiscountChange = (index, newDiscVal) => {
    const disc = parseInt(newDiscVal);
    const updated = [...items];
    const it = updated[index];
    const validDisc = isNaN(disc) ? 0 : Math.min(100, Math.max(0, disc));
    const orig = parseFloat(it.original_price || 0);
    const newOffer = Math.round(orig * (1 - validDisc / 100));
    updated[index] = {
      ...it,
      discount_percent: validDisc,
      offer_price: newOffer,
      total: newOffer * it.quantity
    };
    setItems(updated);
  };

  // Modify net offer price directly for a single item in the bill
  const handleItemRateChange = (index, newRateVal) => {
    const rate = parseFloat(newRateVal);
    const updated = [...items];
    const it = updated[index];
    const validRate = isNaN(rate) ? 0 : Math.max(0, rate);
    const orig = parseFloat(it.original_price || 0);
    const computedDisc = orig > 0 ? Math.round(((orig - validRate) / orig) * 100) : 0;
    updated[index] = {
      ...it,
      offer_price: validRate,
      discount_percent: Math.min(100, Math.max(0, computedDisc)),
      total: validRate * it.quantity
    };
    setItems(updated);
  };

  // Modify MRP for a single item in the bill
  const handleItemMrpChange = (index, newMrpVal) => {
    const orig = parseFloat(newMrpVal) || 0;
    const updated = [...items];
    const it = updated[index];
    const disc = it.discount_percent !== undefined ? it.discount_percent : 83;
    const newOffer = Math.round(orig * (1 - disc / 100));
    updated[index] = {
      ...it,
      original_price: orig,
      offer_price: newOffer,
      total: newOffer * it.quantity
    };
    setItems(updated);
  };

  // Direct number input for Quantity
  const handleItemQtySet = (index, newQtyVal) => {
    const q = Math.max(1, parseInt(newQtyVal) || 1);
    const updated = [...items];
    updated[index].quantity = q;
    updated[index].total = q * updated[index].offer_price;
    setItems(updated);
  };

  // Increment / Decrement Quantity
  const handleItemQtyChange = (index, delta) => {
    const updated = [...items];
    const newQty = Math.max(1, updated[index].quantity + delta);
    updated[index].quantity = newQty;
    updated[index].total = newQty * updated[index].offer_price;
    setItems(updated);
  };

  // Inline edit item name
  const handleItemNameChange = (index, newName) => {
    const updated = [...items];
    updated[index].name = newName;
    setItems(updated);
  };

  // Inline edit item pack size
  const handleItemPackChange = (index, newPack) => {
    const updated = [...items];
    updated[index].pack_size = newPack;
    setItems(updated);
  };

  // Add Item from Catalog (by product object or selected id)
  const handleAddCatalogItem = (prod, customQty = null) => {
    const targetProduct = prod || catalogProducts.find(p => String(p.id) === String(selectedProductId));
    if (!targetProduct) return;

    const qty = parseInt(customQty !== null ? customQty : addQty) || 1;
    const orig = parseFloat(targetProduct.original_price || 0);
    const disc = parseInt(billDiscount) || targetProduct.discount_percent || 83;
    const offer = Math.round(orig * (1 - disc / 100));

    // Check if already in items
    const existingIndex = items.findIndex(it => String(it.id) === String(targetProduct.id));
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += qty;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].offer_price;
      setItems(updated);
      triggerToast(`Increased quantity for "${targetProduct.name}" (+${qty})`);
    } else {
      setItems(prev => [
        ...prev,
        {
          id: targetProduct.id,
          name: targetProduct.name,
          category: targetProduct.category || 'General',
          pack_size: targetProduct.pack_size || 'Box',
          original_price: orig,
          discount_percent: disc,
          offer_price: offer,
          quantity: qty,
          total: offer * qty,
          is_custom: false
        }
      ]);
      triggerToast(`Added "${targetProduct.name}" (${qty} ${targetProduct.pack_size || 'Box'}) to bill!`);
    }

    setSelectedProductId('');
    setAddQty(1);
  };

  // Custom Item Handlers
  const handleCustomMrpChange = (val) => {
    const mrp = parseFloat(val);
    const disc = parseInt(customItem.discount_percent) || 0;
    const newOffer = !isNaN(mrp) && mrp > 0 ? Math.round(mrp * (1 - disc / 100)) : '';
    setCustomItem(prev => ({
      ...prev,
      original_price: val,
      offer_price: newOffer !== '' ? newOffer : prev.offer_price
    }));
  };

  const handleCustomDiscChange = (val) => {
    const disc = parseInt(val) || 0;
    const mrp = parseFloat(customItem.original_price) || 0;
    const newOffer = mrp > 0 ? Math.round(mrp * (1 - disc / 100)) : customItem.offer_price;
    setCustomItem(prev => ({
      ...prev,
      discount_percent: val,
      offer_price: newOffer !== '' ? newOffer : prev.offer_price
    }));
  };

  const handleCustomRateChange = (val) => {
    const rate = parseFloat(val);
    const mrp = parseFloat(customItem.original_price) || 0;
    let disc = customItem.discount_percent;
    if (mrp > 0 && !isNaN(rate) && mrp >= rate) {
      disc = Math.min(100, Math.max(0, Math.round(((mrp - rate) / mrp) * 100)));
    }
    setCustomItem(prev => ({
      ...prev,
      offer_price: val,
      discount_percent: disc
    }));
  };

  // Presets for quick adding extra items
  const customPresets = [
    { name: 'Safety Matches Box (தீப்பெட்டி)', pack_size: '1 Bundle (10 Boxes)', mrp: 80, rate: 40 },
    { name: 'Incense Sticks / Agarbathi (ஊதுபத்தி)', pack_size: '1 Pkt', mrp: 50, rate: 25 },
    { name: 'Special Diwali Gift Box (பரிசுப் பெட்டி)', pack_size: '1 Big Box', mrp: 2500, rate: 425 },
    { name: '1000 Wala Extra Chain Crackers', pack_size: '1 Piece', mrp: 1200, rate: 204 },
    { name: 'Sparklers Extra Pack (மத்தாப்பு)', pack_size: '5 Boxes', mrp: 450, rate: 75 }
  ];

  const handleApplyPreset = (p) => {
    const disc = parseInt(billDiscount) || 83;
    const computedOffer = p.mrp ? Math.round(p.mrp * (1 - disc / 100)) : p.rate;
    setCustomItem({
      name: p.name,
      pack_size: p.pack_size,
      original_price: p.mrp || (p.rate * 2),
      discount_percent: disc,
      offer_price: computedOffer,
      quantity: 1
    });
  };

  // Add Custom / Extra Item to the bill
  const handleAddCustomItem = (e) => {
    if (e) e.preventDefault();
    if (!customItem.name.trim()) {
      alert('Please enter an Item Name for the extra item.');
      return;
    }

    const qty = parseInt(customItem.quantity) || 1;
    const orig = parseFloat(customItem.original_price) || 0;
    const disc = parseInt(customItem.discount_percent) || 0;
    let offer = parseFloat(customItem.offer_price);

    if (isNaN(offer) || offer <= 0) {
      if (orig > 0) {
        offer = Math.round(orig * (1 - disc / 100));
      } else {
        alert('Please enter a valid MRP or Net Rate for the extra item.');
        return;
      }
    }

    const calculatedOrig = orig > 0 ? orig : (disc > 0 && disc < 100 ? Math.round(offer / (1 - disc / 100)) : offer);

    const newItem = {
      id: 'extra-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: customItem.name.trim(),
      category: 'Extra Item',
      pack_size: customItem.pack_size.trim() || '1 Box',
      original_price: calculatedOrig,
      discount_percent: disc,
      offer_price: offer,
      quantity: qty,
      total: offer * qty,
      is_custom: true
    };

    setItems(prev => [...prev, newItem]);
    triggerToast(`Added extra item "${newItem.name}" to bill!`);

    // Reset form
    setCustomItem({
      name: '',
      pack_size: '1 Box',
      original_price: '',
      discount_percent: parseInt(billDiscount) || 83,
      offer_price: '',
      quantity: 1
    });
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleClearAllItems = () => {
    if (window.confirm('Are you sure you want to remove all items from this bill?')) {
      setItems([]);
      triggerToast('All items removed from bill.');
    }
  };

  // Filter items in the table if search query is provided
  const displayedItemsWithIndex = useMemo(() => {
    const q = tableSearchQuery.trim().toLowerCase();
    return items.map((it, idx) => ({ ...it, originalIndex: idx })).filter(it => {
      if (!q) return true;
      return (it.name && it.name.toLowerCase().includes(q)) || 
             (it.pack_size && it.pack_size.toLowerCase().includes(q)) ||
             (it.category && it.category.toLowerCase().includes(q));
    });
  }, [items, tableSearchQuery]);

  // Calculations
  const grossTotal = items.reduce((sum, it) => {
    const orig = parseFloat(it.original_price || (it.offer_price ? it.offer_price * 4 : 0));
    return sum + (orig * it.quantity);
  }, 0);
  const netItemsTotal = items.reduce((sum, it) => {
    const offer = parseFloat(it.offer_price || 0);
    return sum + (offer * it.quantity);
  }, 0);
  const discountSavings = Math.max(0, grossTotal - netItemsTotal);
  const effectiveDiscountPercent = grossTotal > 0
    ? Math.round((discountSavings / grossTotal) * 100)
    : (parseInt(billDiscount) || 83);
  const grandTotal = Math.round(netItemsTotal + parseFloat(packagingCharge || 0) + parseFloat(deliveryCharge || 0));

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const itemsSummary = items.length > 0 
      ? items.map((it, idx) => 
          `${idx + 1}. ${it.name} (${it.pack_size || 'Box'}) x ${it.quantity} = ₹${it.total || (it.offer_price * it.quantity)}`
        ).join('\n')
      : 'No items listed';

    const msg = `*🎇 SRI JEYAM CRACKERS - SIVAKASI*\n*OFFICIAL ESTIMATE / TAX BILL*\n\n` +
      `*Bill No:* ${invoiceNumber}\n` +
      `*Date:* ${invoiceDate}\n` +
      `*Customer:* ${customerName || 'Valued Customer'}\n` +
      `*Phone:* ${customerPhone || 'N/A'}\n\n` +
      `*Order Items:*\n${itemsSummary}\n\n` +
      `-----------------------------\n` +
      `*Actual MRP Total:* ₹${Math.round(grossTotal)}\n` +
      `*Festive Discount (-${effectiveDiscountPercent}%):* -₹${Math.round(discountSavings)}\n` +
      (parseFloat(packagingCharge) > 0 ? `*Packaging/Packing:* +₹${packagingCharge}\n` : '') +
      (parseFloat(deliveryCharge) > 0 ? `*Delivery/Transport:* +₹${deliveryCharge}\n` : '') +
      `*NET PAYABLE AMOUNT:* *₹${grandTotal}*\n` +
      `-----------------------------\n\n` +
      `*For Enquiries & Parcel Dispatch:* 6380115587\n` +
      `Thank you for choosing Sri Jeyam Crackers Sivakasi! 🎆`;

    const cleanPhone = customerPhone ? customerPhone.replace(/[^0-9]/g, '').slice(-10) : '';
    if (cleanPhone && cleanPhone.length === 10) {
      window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      window.open(`https://wa.me/916380115587?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleSaveAsOrder = () => {
    if (!customerName || !customerPhone) {
      alert('Customer Name and Phone Number are required to save this bill as an order.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one cracker item to the bill.');
      return;
    }

    if (onSaveOrder) {
      onSaveOrder({
        order_number: invoiceNumber,
        customer_name: customerName,
        phone_number: customerPhone,
        address: customerAddress || 'Counter Pickup',
        city: customerCity || 'Sivakasi',
        items,
        subtotal: Math.round(grossTotal),
        discount: Math.round(discountSavings),
        discount_percent: effectiveDiscountPercent,
        total_amount: grandTotal,
        status: 'Confirmed',
        payment_method: paymentMode
      });
    }
  };

  return (
    <div className="print-bill-modal-overlay fixed inset-0 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="print-bill-modal-content w-full max-w-4xl bg-white border-0 sm:border border-slate-200 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-0 sm:max-h-[92vh]">
        
        {/* Top Header Bar - Hidden in Print */}
        <div className="no-print bg-slate-50 border-b border-slate-200 p-3 sm:p-4 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl sm:text-2xl diya-glow shrink-0">🪔</span>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-black font-poster text-slate-900 truncate">
                  Bill & Tax Invoice Generator
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  Counter billing, print A4, or WhatsApp receipt
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Buttons Row */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
              title="Print standard A4 Invoice or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
              title="Send formatted bill to customer via WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Bill</span>
            </button>

            {onSaveOrder && !order?.id && (
              <button
                onClick={handleSaveAsOrder}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Save as Order</span>
              </button>
            )}
          </div>
        </div>

        {/* COUNTER BILLING CONTROLS & ADD ITEMS SECTION - Hidden in Print */}
        <div className="no-print bg-slate-50 border-b border-slate-200 p-3 sm:p-4 text-xs space-y-3 shrink-0">
          
          {/* Toast Notification Banner */}
          {toastMsg && (
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-2 animate-in fade-in text-xs shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Tab Selector: Catalog Search vs. Custom Extra Item */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
            <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAddItemMode('catalog')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  addItemMode === 'catalog'
                    ? 'bg-white text-red-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Catalog Search</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-mono shrink-0">
                  {catalogProducts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAddItemMode('custom')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  addItemMode === 'custom'
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Extra Item (கூடுதல்)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-semibold shrink-0">
                  Extra
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end text-[11px] text-slate-500 font-medium pt-1 sm:pt-0">
              <span>Items on Bill: <strong className="text-slate-900 font-mono">{items.length}</strong></span>
              <span className="mx-2">•</span>
              <span>Total Net: <strong className="text-red-700 font-mono text-sm">₹{grandTotal}</strong></span>
            </div>
          </div>

          {/* TAB 1: CATALOG SEARCH & QUICK-ADD */}
          {addItemMode === 'catalog' && (
            <div className="space-y-2.5">
              {/* Search Bar + Category Filter + Qty */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                
                {/* Search Input */}
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search cracker name (e.g. sparkler, 1000, chakra)..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-slate-900 text-xs font-medium outline-none transition-all shadow-xs"
                  />
                  {searchFilter && (
                    <button
                      type="button"
                      onClick={() => setSearchFilter('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Dropdown Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold outline-none focus:border-red-500"
                  >
                    {productCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? `All Categories (${catalogProducts.length})` : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Quantity Selector */}
                <div className="sm:col-span-3 flex items-center justify-between gap-1 bg-white border border-slate-300 rounded-xl px-2 py-1 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500">Qty:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setAddQty(Math.max(1, addQty - 1))}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={addQty}
                      onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-10 text-center font-bold text-slate-900 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setAddQty(addQty + 1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Search Results / Quick Picker Panel */}
              {searchFilter.trim() || selectedCategory !== 'all' ? (
                <div className="bg-white border border-slate-300 rounded-xl p-2 max-h-52 overflow-y-auto space-y-1.5 shadow-md">
                  <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 pb-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">
                      Matching Crackers ({filteredPickerProducts.length}):
                    </span>
                    {searchFilter && (
                      <button
                        type="button"
                        onClick={() => setSearchFilter('')}
                        className="text-red-600 hover:underline text-[10px]"
                      >
                        Reset Search
                      </button>
                    )}
                  </div>

                  {filteredPickerProducts.length > 0 ? (
                    filteredPickerProducts.map(prod => {
                      const orig = parseFloat(prod.original_price || 0);
                      const disc = parseInt(billDiscount) || prod.discount_percent || 83;
                      const offer = Math.round(orig * (1 - disc / 100));
                      const alreadyInBill = items.find(it => String(it.id) === String(prod.id));

                      return (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-300 transition-colors gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 shrink-0">
                                {prod.category || 'General'}
                              </span>
                              <span className="font-bold text-slate-900 text-xs truncate">
                                {prod.name}
                              </span>
                              {alreadyInBill && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                                  In Bill (x{alreadyInBill.quantity})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                              <span>Packing: {prod.pack_size || 'Box'}</span>
                              <span>•</span>
                              <span>MRP: <del className="text-slate-400">₹{orig}</del></span>
                              <span>•</span>
                              <span className="text-red-700 font-bold font-mono">Net: ₹{offer}</span>
                              <span className="text-emerald-600 text-[10px] font-bold">({disc}% OFF)</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddCatalogItem(prod)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add (+{addQty})</span>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <p className="text-slate-500 italic text-xs">
                        No catalog crackers found matching "{searchFilter}".
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAddItemMode('custom');
                          setCustomItem(prev => ({
                            ...prev,
                            name: searchFilter,
                            pack_size: '1 Box'
                          }));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add "{searchFilter}" as Custom Extra Item</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Or Quick Dropdown Selector for Fast Sequential Pick */
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <div className="flex-1">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-red-500"
                    >
                      <option value="">-- Choose Cracker from Catalog ({catalogProducts.length} items) --</option>
                      {filteredPickerProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          [{p.category}] {p.name} ({p.pack_size || 'Box'}) - MRP ₹{p.original_price} (Net: ₹{p.offer_price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddCatalogItem()}
                    disabled={!selectedProductId}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Bill</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADD EXTRA / CUSTOM ITEM */}
          {addItemMode === 'custom' && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-amber-700" />
                  <span>Add Extra / Custom Item (கூடுதல் பட்டாசு / பொருள்):</span>
                </div>
                <span className="text-[11px] text-amber-800">
                  For gift hampers, matches or items not in catalog
                </span>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-bold text-amber-900">Presets:</span>
                {customPresets.map((pr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(pr)}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    + {pr.name.split(' (')[0]}
                  </button>
                ))}
              </div>

              {/* Custom Item Form */}
              <form onSubmit={handleAddCustomItem} className="space-y-3 pt-1">
                <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-end">
                  
                  {/* Name */}
                  <div className="col-span-2 sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Item Name / Description *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Special Gift Hamper / Matches Pack / 1000 Wala"
                      value={customItem.name}
                      onChange={(e) => setCustomItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 focus:border-amber-500 text-slate-900 text-xs font-medium outline-none"
                    />
                  </div>

                  {/* Pack Size */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Packing / Unit
                    </label>
                    <input
                      type="text"
                      placeholder="1 Box / 1 Pkt"
                      value={customItem.pack_size}
                      onChange={(e) => setCustomItem(prev => ({ ...prev, pack_size: e.target.value }))}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 focus:border-amber-500 text-slate-900 text-xs outline-none"
                    />
                  </div>

                  {/* MRP */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 500"
                      value={customItem.original_price}
                      onChange={(e) => handleCustomMrpChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 focus:border-amber-500 text-slate-900 text-xs font-mono outline-none"
                    />
                  </div>

                  {/* Disc % */}
                  <div className="col-span-1 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5 text-center sm:text-left">
                      Disc %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={customItem.discount_percent}
                      onChange={(e) => handleCustomDiscChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 focus:border-amber-500 text-slate-900 text-xs font-mono text-center outline-none"
                    />
                  </div>

                  {/* Net Rate */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Net Rate (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 85"
                      value={customItem.offer_price}
                      onChange={(e) => handleCustomRateChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-amber-300 focus:border-amber-600 font-black text-amber-900 text-xs font-mono outline-none"
                    />
                  </div>

                  {/* Qty */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5 text-center">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={customItem.quantity}
                      onChange={(e) => setCustomItem(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-center font-bold text-slate-900 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="text-[11px] text-slate-600">
                    Preview Total: <strong className="font-mono text-slate-900">₹{((parseFloat(customItem.offer_price) || 0) * (parseInt(customItem.quantity) || 1))}</strong>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Extra Item to Bill</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-slate-100/70">
          
          {/* THE OFFICIAL PRINTABLE INVOICE BILL */}
          <div className="print-bill-container bg-white text-slate-900 rounded-2xl shadow-xl p-4 sm:p-8 max-w-3xl mx-auto border border-slate-200">
            
            {/* INVOICE HEADER */}
            <div className="border-b-2 border-slate-800 pb-4 mb-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🪔</span>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-red-700">
                      SRI JEYAM CRACKERS
                    </h1>
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-0.5">
                    ஸ்ரீ ஜெயம் பட்டாசு • Direct Sivakasi Wholesale & Retail
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
                    <div>Sivakasi Main Road, Sivakasi - 626123, Tamil Nadu, India</div>
                    <div>Mobile: <strong>6380115587</strong></div>
                    <div>Website: <strong>srijeyamcrackers.com</strong></div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-md font-black text-xs uppercase tracking-wider mb-1 border border-red-300">
                    Tax / Cash Estimate Bill
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Bill No: <strong className="text-slate-900 font-mono text-sm">{invoiceNumber}</strong>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Date: <strong className="text-slate-900 font-mono">{invoiceDate}</strong>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Pay Mode: <strong className="text-emerald-700">{paymentMode}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* CUSTOMER / BILL TO SECTION */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mb-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Billed To (Customer Details):
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-slate-900 text-sm">
                        {customerName || 'Walk-in Customer'}
                      </strong>
                    </div>
                    <div className="text-slate-700">
                      Phone: <strong className="font-mono">{customerPhone || 'N/A'}</strong>
                    </div>
                    <div className="text-slate-600">
                      Address: {customerAddress || 'Direct Counter Delivery'}, {customerCity}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right flex flex-col justify-end text-[11px] text-slate-500">
                  <div>Festival: <strong>Diwali Special 2026</strong></div>
                  <div>Discount Scheme: <strong className="text-red-600">FLAT {effectiveDiscountPercent}% OFF Sivakasi Wholesale</strong></div>
                  <div>Origin: <strong>Sivakasi Certified Green Crackers</strong></div>
                </div>
              </div>
            </div>

            {/* EDITABLE CUSTOMER INPUTS & BILL CHARGES (FOR COUNTER BILLING - Hidden in Print) */}
            <div className="no-print mb-4 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-xs space-y-3 shadow-xs">
              
              {/* Customer Inputs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5">Customer Mobile</label>
                  <input
                    type="text"
                    placeholder="Enter phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-0.5">City / Town</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Bill Charges & Customer Discount Controls Row */}
              <div className="pt-2 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/90 p-3 rounded-xl border border-amber-100">
                
                {/* Customer Discount % */}
                <div className="sm:col-span-6 space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-extrabold text-amber-950 flex items-center gap-1 text-[11px]">
                      <Percent className="w-3.5 h-3.5 text-amber-600" />
                      Discount % (தள்ளுபடி):
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={billDiscount}
                        onChange={(e) => setBillDiscount(e.target.value)}
                        className="w-14 p-1 text-center font-black font-mono bg-white border border-amber-300 rounded-lg text-slate-900 text-xs focus:ring-1 focus:ring-amber-500"
                      />
                      <span className="font-bold text-amber-900 text-xs">%</span>
                      <button
                        type="button"
                        onClick={() => handleApplyBillDiscount(billDiscount)}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shadow-xs cursor-pointer active:scale-95"
                        title="Apply this discount to all items on bill"
                      >
                        Apply All
                      </button>
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] text-amber-800 font-semibold">Presets:</span>
                    {[85, 83, 80, 75, 70].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleApplyBillDiscount(pct)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black border transition-all cursor-pointer ${
                          parseInt(billDiscount) === pct
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Packaging & Delivery Charges */}
                <div className="sm:col-span-6 border-t sm:border-t-0 sm:border-l border-amber-200/80 sm:pl-3 pt-2 sm:pt-0 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5 flex items-center gap-1">
                      <Package className="w-3 h-3 text-amber-700" />
                      Packing (₹):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={packagingCharge}
                      onChange={(e) => setPackagingCharge(e.target.value)}
                      placeholder="0"
                      className="w-full p-1.5 rounded-lg bg-white border border-slate-300 font-mono text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-emerald-700" />
                      Delivery (₹):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={deliveryCharge}
                      onChange={(e) => setDeliveryCharge(e.target.value)}
                      placeholder="0"
                      className="w-full p-1.5 rounded-lg bg-white border border-slate-300 font-mono text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ITEMS SECTION & TOOLBAR */}
            <div className="mb-4 space-y-2">
              
              {/* Table Search & Action Toolbar - Hidden in Print */}
              <div className="no-print flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-sm relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    placeholder="Filter items on this bill (e.g. sparkler)..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs outline-none focus:border-red-500"
                  />
                  {tableSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTableSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-600 font-semibold">
                    {tableSearchQuery 
                      ? `Showing ${displayedItemsWithIndex.length} of ${items.length} items` 
                      : `Total Items: ${items.length}`}
                  </span>

                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllItems}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                      title="Clear all items from this bill"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear Bill</span>
                    </button>
                  )}
                </div>
              </div>

              {/* MOBILE TOUCH CARDS VIEW (Displayed on screens < sm, hidden in print) */}
              <div className="no-print sm:hidden space-y-2.5">
                {displayedItemsWithIndex.length > 0 ? (
                  displayedItemsWithIndex.map((it, displayIdx) => {
                    const originalIdx = it.originalIndex;
                    return (
                      <div 
                        key={it.id || originalIdx} 
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 text-xs shadow-xs"
                      >
                        {/* Title & Delete */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <span className="font-mono font-bold text-slate-400 text-xs">#{displayIdx + 1}</span>
                            {it.is_custom && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                                Extra
                              </span>
                            )}
                            <input
                              type="text"
                              value={it.name}
                              onChange={(e) => handleItemNameChange(originalIdx, e.target.value)}
                              className="w-full font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-red-500"
                              title="Edit item name"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(originalIdx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg shrink-0 cursor-pointer"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>

                        {/* Pricing Details */}
                        <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Packing</span>
                            <input
                              type="text"
                              value={it.pack_size || 'Box'}
                              onChange={(e) => handleItemPackChange(originalIdx, e.target.value)}
                              className="w-full font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">MRP (₹)</span>
                            <input
                              type="number"
                              min="0"
                              value={it.original_price}
                              onChange={(e) => handleItemMrpChange(originalIdx, e.target.value)}
                              className="w-full font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Disc %</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={it.discount_percent !== undefined ? it.discount_percent : 83}
                              onChange={(e) => handleItemDiscountChange(originalIdx, e.target.value)}
                              className="w-full font-bold text-red-600 bg-red-50/70 border border-red-200 rounded px-1 py-0.5 text-xs text-center outline-none"
                            />
                          </div>
                        </div>

                        {/* Rate, Stepper Quantity & Total */}
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 font-bold">Rate:</span>
                            <span className="text-slate-400 text-xs font-mono">₹</span>
                            <input
                              type="number"
                              min="0"
                              value={it.offer_price}
                              onChange={(e) => handleItemRateChange(originalIdx, e.target.value)}
                              className="w-16 font-bold text-slate-900 font-mono bg-white border border-slate-300 rounded px-1.5 py-1 text-xs outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleItemQtyChange(originalIdx, -1)}
                              className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={it.quantity}
                              onChange={(e) => handleItemQtySet(originalIdx, e.target.value)}
                              className="w-12 h-7 text-center font-bold font-mono bg-white border border-slate-300 rounded-lg text-xs outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleItemQtyChange(originalIdx, 1)}
                              className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-bold">Amount</div>
                            <div className="font-black text-slate-900 font-mono text-sm">₹{it.total}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : items.length > 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-xs">
                    No items in this bill match "{tableSearchQuery}".
                    <button
                      type="button"
                      onClick={() => setTableSearchQuery('')}
                      className="ml-2 text-red-600 font-bold underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400 text-xs italic">
                    No crackers or extra items added to this bill yet.
                  </div>
                )}
              </div>

              {/* DESKTOP TABLE VIEW (Visible on sm+ and in print) */}
              <div className="hidden sm:block print:block overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 w-10 text-center">S.No</th>
                      <th className="p-2">Description / Cracker Item</th>
                      <th className="p-2 w-20 text-center">Packing</th>
                      <th className="p-2 w-20 text-right">MRP (₹)</th>
                      <th className="p-2 w-20 text-center">Disc %</th>
                      <th className="p-2 w-24 text-right">Rate (₹)</th>
                      <th className="p-2 w-24 text-center">Qty</th>
                      <th className="p-2 w-20 text-right">Amount (₹)</th>
                      <th className="p-2 w-10 text-center no-print">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {displayedItemsWithIndex.length > 0 ? (
                      displayedItemsWithIndex.map((it, displayIdx) => {
                        const originalIdx = it.originalIndex;
                        return (
                          <tr key={it.id || originalIdx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2 text-center text-slate-500 font-mono">
                              {displayIdx + 1}
                            </td>
                            
                            {/* Description / Item Name */}
                            <td className="p-2 font-semibold text-slate-900">
                              <span className="print-only">{it.name}</span>
                              <div className="no-print flex items-center gap-1.5">
                                {it.is_custom && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                                    Extra
                                  </span>
                                )}
                                <input
                                  type="text"
                                  value={it.name}
                                  onChange={(e) => handleItemNameChange(originalIdx, e.target.value)}
                                  className="w-full font-semibold text-slate-900 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-amber-400 rounded px-1 py-0.5 outline-none transition-colors"
                                  title="Click to edit item name"
                                />
                              </div>
                            </td>

                            {/* Packing */}
                            <td className="p-2 text-center text-slate-600">
                              <span className="print-only">{it.pack_size || 'Box'}</span>
                              <div className="no-print flex items-center justify-center">
                                <input
                                  type="text"
                                  value={it.pack_size || 'Box'}
                                  onChange={(e) => handleItemPackChange(originalIdx, e.target.value)}
                                  className="w-18 text-center text-slate-700 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-amber-400 rounded px-1 py-0.5 outline-none text-xs"
                                  title="Click to edit packing size"
                                />
                              </div>
                            </td>

                            {/* MRP */}
                            <td className="p-2 text-right text-slate-500 font-mono">
                              <span className="print-only">₹{it.original_price}</span>
                              <div className="no-print flex items-center justify-end">
                                <span className="text-slate-400 text-[10px]">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={it.original_price}
                                  onChange={(e) => handleItemMrpChange(originalIdx, e.target.value)}
                                  className="w-16 text-right font-mono text-slate-600 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-amber-400 rounded px-1 py-0.5 outline-none text-xs"
                                  title="Click to edit MRP"
                                />
                              </div>
                            </td>

                            {/* Disc % */}
                            <td className="p-2 text-center text-red-600 font-bold">
                              <span className="print-only">{it.discount_percent !== undefined ? it.discount_percent : 83}%</span>
                              <div className="no-print flex items-center justify-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={it.discount_percent !== undefined ? it.discount_percent : 83}
                                  onChange={(e) => handleItemDiscountChange(originalIdx, e.target.value)}
                                  className="w-14 p-1 text-center font-bold text-red-600 bg-red-50/70 border border-red-300 rounded text-xs focus:ring-1 focus:ring-red-500"
                                  title="Edit item discount %"
                                />
                              </div>
                            </td>

                            {/* Rate */}
                            <td className="p-2 text-right font-bold text-slate-900 font-mono">
                              <span className="print-only">₹{it.offer_price}</span>
                              <div className="no-print flex items-center justify-end gap-0.5">
                                <span className="text-slate-400 text-[10px]">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={it.offer_price}
                                  onChange={(e) => handleItemRateChange(originalIdx, e.target.value)}
                                  className="w-16 p-1 text-right font-bold text-slate-900 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 font-mono"
                                  title="Or type custom net price"
                                />
                              </div>
                            </td>

                            {/* Qty with direct input and +/- buttons */}
                            <td className="p-2 text-center font-bold font-mono">
                              <span className="print-only">{it.quantity}</span>
                              <div className="no-print flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleItemQtyChange(originalIdx, -1)}
                                  className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                                  title="Decrease quantity"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={it.quantity}
                                  onChange={(e) => handleItemQtySet(originalIdx, e.target.value)}
                                  className="w-11 p-0.5 text-center font-bold font-mono bg-white border border-slate-300 rounded text-xs outline-none focus:border-red-500"
                                  title="Type quantity directly"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleItemQtyChange(originalIdx, 1)}
                                  className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                                  title="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Amount */}
                            <td className="p-2 text-right font-black text-slate-900 font-mono">
                              ₹{it.total}
                            </td>

                            {/* Action */}
                            <td className="p-2 text-center no-print">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(originalIdx)}
                                className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                                title="Remove Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : items.length > 0 ? (
                      <tr>
                        <td colSpan="9" className="p-6 text-center text-slate-500 italic">
                          No items in this bill match "{tableSearchQuery}".
                          <button
                            type="button"
                            onClick={() => setTableSearchQuery('')}
                            className="ml-2 text-red-600 font-bold underline cursor-pointer"
                          >
                            Clear Filter
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-slate-400 italic">
                          No crackers or extra items added to this bill yet. Use the search or extra item creator above to populate the bill.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TOTALS & SUMMARY SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 border-t-2 border-slate-800 pt-4 mb-4 text-xs">
              
              {/* Left Column: Customer Support Info on the Bill */}
              <div className="sm:col-span-7 space-y-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Customer & Dispatch Support</span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-0.5">
                    <div>Helpline / WhatsApp: <strong className="font-mono text-slate-900 font-bold">6380115587</strong></div>
                    <div className="text-[10px] text-slate-500 pt-0.5">For order verification and dispatch tracking, please contact our helpline.</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 italic">
                  <strong>Amount in Words:</strong> {numberToWords(grandTotal)}
                </div>
              </div>

              {/* Right Column: Calculations */}
              <div className="sm:col-span-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Actual MRP Total:</span>
                  <span className="font-mono font-medium">₹{Math.round(grossTotal)}</span>
                </div>

                <div className="flex justify-between text-red-600 font-bold">
                  <span>Festive Discount (-{effectiveDiscountPercent}%):</span>
                  <span className="font-mono">-₹{Math.round(discountSavings)}</span>
                </div>

                <div className="flex justify-between text-slate-800 font-semibold border-t border-slate-200 pt-1">
                  <span>Net Items Amount:</span>
                  <span className="font-mono">₹{Math.round(netItemsTotal)}</span>
                </div>

                {/* Packaging & Delivery Controls (Mirrored for calculation clarity) */}
                <div className="no-print grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Packing (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={packagingCharge}
                      onChange={(e) => setPackagingCharge(e.target.value)}
                      className="w-full p-1 rounded bg-white border border-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Delivery (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={deliveryCharge}
                      onChange={(e) => setDeliveryCharge(e.target.value)}
                      className="w-full p-1 rounded bg-white border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>

                {(parseFloat(packagingCharge) > 0 || parseFloat(deliveryCharge) > 0) && (
                  <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                    {parseFloat(packagingCharge) > 0 && (
                      <div className="flex justify-between">
                        <span>Packing Charges:</span>
                        <span className="font-mono">+₹{packagingCharge}</span>
                      </div>
                    )}
                    {parseFloat(deliveryCharge) > 0 && (
                      <div className="flex justify-between">
                        <span>Transport / Delivery:</span>
                        <span className="font-mono">+₹{deliveryCharge}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline font-black text-base text-slate-900">
                  <span>GRAND TOTAL:</span>
                  <span className="text-lg text-red-700 font-mono">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* TERMS & SIGNATURE FOOTER */}
            <div className="border-t border-slate-300 pt-4 text-[10px] text-slate-500 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong className="text-slate-700 block mb-0.5">Terms & Conditions:</strong>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>100% Genuine Sivakasi standard high quality fireworks.</li>
                  <li>Light under adult supervision in open ground. Keep water bucket handy.</li>
                  <li>Goods once sold cannot be taken back or exchanged.</li>
                  <li>Subject to Sivakasi Jurisdiction.</li>
                </ol>
              </div>

              <div className="sm:text-right flex flex-col justify-end pt-4 sm:pt-0">
                <div className="font-bold text-slate-800 text-xs">For SRI JEYAM CRACKERS</div>
                <div className="h-10"></div>
                <div className="text-slate-600 border-t border-slate-400 inline-block pt-0.5 font-medium">
                  Authorized Signatory / Manager
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar - Hidden in Print */}
        <div className="no-print bg-midnight-900 border-t border-slate-800 p-3 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="text-slate-400 text-xs">
            Items: <strong className="text-white">{items.length}</strong> • Total: <strong className="text-festive-gold font-mono text-sm sm:text-base">₹{grandTotal}</strong> <span className="text-emerald-400 font-bold ml-1">({effectiveDiscountPercent}% OFF)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow text-xs cursor-pointer active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print A4 Invoice</span>
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow text-xs cursor-pointer active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp to Customer</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
