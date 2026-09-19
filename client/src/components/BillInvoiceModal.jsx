import React, { useState, useEffect } from 'react';
import { 
  Printer, MessageSquare, X, Plus, Trash2, Check, Download, 
  Smartphone, Phone, Calendar, User, MapPin, Hash, Sparkles, AlertCircle
} from 'lucide-react';

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
    const disc = it.discount_percent !== undefined ? it.discount_percent : 75;
    const offer = parseFloat(it.offer_price !== undefined ? it.offer_price : (orig ? Math.round(orig * (1 - disc / 100)) : 0));
    const qty = parseInt(it.quantity) || 1;
    return {
      id: it.id || it.product_id || Math.random(),
      name: it.name || it.product_name || 'Cracker Item',
      pack_size: it.pack_size || 'Box',
      original_price: orig,
      discount_percent: disc,
      offer_price: offer,
      quantity: qty,
      total: it.total !== undefined ? parseFloat(it.total) : (offer * qty)
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
  const [paymentMode, setPaymentMode] = useState(order?.payment_method || 'Cash / UPI');
  const [packagingCharge, setPackagingCharge] = useState(order?.packaging_charge || 0);
  const [deliveryCharge, setDeliveryCharge] = useState(order?.delivery_charge || 0);
  const [items, setItems] = useState(() => parseOrderItems(order));

  // Sync state whenever order prop changes or modal is re-opened
  useEffect(() => {
    if (order) {
      setInvoiceNumber(order.order_number || `SJC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setInvoiceDate(order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setCustomerName(order.customer_name || '');
      setCustomerPhone(order.phone_number || order.whatsapp_number || order.phone || '');
      setCustomerAddress(order.address || '');
      setCustomerCity(order.city || 'Tamil Nadu');
      setPaymentMode(order.payment_method || 'Cash / UPI');
      setPackagingCharge(order.packaging_charge || 0);
      setDeliveryCharge(order.delivery_charge || 0);
      setItems(parseOrderItems(order));
    } else {
      setInvoiceNumber(`SJC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCustomerCity('Tamil Nadu');
      setPaymentMode('Cash / UPI');
      setPackagingCharge(0);
      setDeliveryCharge(0);
      setItems([]);
    }
  }, [order]);

  // Product Picker for counter billing
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addQty, setAddQty] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const prod = products.find(p => String(p.id) === String(selectedProductId));
    if (!prod) return;

    const orig = parseFloat(prod.original_price || 0);
    const disc = prod.discount_percent || 75;
    const offer = parseFloat(prod.offer_price || Math.round(orig * (1 - disc / 100)));
    const qty = parseInt(addQty) || 1;

    // Check if already in items
    const existingIndex = items.findIndex(it => String(it.id) === String(prod.id));
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += qty;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].offer_price;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          id: prod.id,
          name: prod.name,
          pack_size: prod.pack_size || 'Box',
          original_price: orig,
          discount_percent: disc,
          offer_price: offer,
          quantity: qty,
          total: offer * qty
        }
      ]);
    }

    setSelectedProductId('');
    setAddQty(1);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemQtyChange = (index, delta) => {
    const updated = [...items];
    const newQty = Math.max(1, updated[index].quantity + delta);
    updated[index].quantity = newQty;
    updated[index].total = newQty * updated[index].offer_price;
    setItems(updated);
  };

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
      `*75% Festive Discount:* -₹${Math.round(discountSavings)}\n` +
      (parseFloat(packagingCharge) > 0 ? `*Packaging/Packing:* +₹${packagingCharge}\n` : '') +
      (parseFloat(deliveryCharge) > 0 ? `*Delivery/Transport:* +₹${deliveryCharge}\n` : '') +
      `*NET PAYABLE AMOUNT:* *₹${grandTotal}*\n` +
      `-----------------------------\n\n` +
      `*💳 Payment Details (UPI):*\n` +
      `*GPay / PhonePe / Paytm:* 8939910664\n` +
      `*UPI ID:* 8939910664@icici\n\n` +
      `*Contact:* 6380115587 / 9363243938\n` +
      `Thank you for choosing Sri Jeyam Crackers Sivakasi! 🎆`;

    const cleanPhone = customerPhone ? customerPhone.replace(/[^0-9]/g, '').slice(-10) : '';
    if (cleanPhone && cleanPhone.length === 10) {
      window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      window.open(`https://wa.me/916370115587?text=${encodeURIComponent(msg)}`, '_blank');
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
        total_amount: grandTotal,
        status: 'Confirmed',
        payment_method: paymentMode
      });
    }
  };

  const filteredPickerProducts = products.filter(p => 
    !searchFilter || 
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="print-bill-modal-overlay fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="print-bill-modal-content w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar - Hidden in Print */}
        <div className="no-print bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl diya-glow">🪔</span>
            <div>
              <h2 className="text-base font-black font-poster text-slate-900">
                Official Bill & Tax Invoice Generator
              </h2>
              <p className="text-[11px] text-slate-500">
                Print A4 invoice, WhatsApp bill receipt, or direct counter billing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow"
              title="Print standard A4 Invoice or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              title="Send formatted bill to customer via WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Bill</span>
            </button>

            {onSaveOrder && !order?.id && (
              <button
                onClick={handleSaveAsOrder}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Check className="w-4 h-4" />
                <span>Save as Order</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Counter Billing Product Selector - Hidden in Print */}
        <div className="no-print bg-slate-50 border-b border-slate-200 p-3 sm:p-4 text-xs space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-red-600" />
            <span>Counter Billing / Add Crackers to this Bill:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            <div className="sm:col-span-7">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-red-500"
              >
                <option value="">-- Choose Cracker from Catalog ({products.length} items) --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.category}] {p.name} - MRP ₹{p.original_price} (Net: ₹{p.offer_price})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-1">
              <span className="text-slate-500">Qty:</span>
              <input
                type="number"
                min="1"
                value={addQty}
                onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-center font-bold text-xs outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedProductId}
                className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Cracker</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/70">
          
          {/* THE OFFICIAL PRINTABLE INVOICE BILL */}
          <div className="print-bill-container bg-white text-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 max-w-3xl mx-auto border border-slate-200">
            
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
                    <div>Mobile: <strong>6380115587</strong> / <strong>9363243938</strong></div>
                    <div>Website: <strong>srijeyamcrackers.com</strong></div>
                  </div>
                </div>

                <div className="text-right sm:text-right">
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
                  <div>Discount Scheme: <strong className="text-red-600">FLAT 75% OFF Sivakasi Wholesale</strong></div>
                  <div>Origin: <strong>Sivakasi Certified Green Crackers</strong></div>
                </div>
              </div>
            </div>

            {/* EDITABLE CUSTOMER INPUTS (FOR COUNTER BILLING - Hidden in Print) */}
            <div className="no-print mb-4 p-3 bg-slate-100 rounded-xl border border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-0.5">Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-1.5 rounded bg-white border border-slate-300 text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-0.5">Customer Mobile</label>
                <input
                  type="text"
                  placeholder="Enter phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-1.5 rounded bg-white border border-slate-300 text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-0.5">City / Town</label>
                <input
                  type="text"
                  placeholder="City"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full p-1.5 rounded bg-white border border-slate-300 text-slate-900 text-xs"
                />
              </div>
            </div>

            {/* ITEMS TABLE */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 w-10 text-center">S.No</th>
                    <th className="p-2">Description / Cracker Item</th>
                    <th className="p-2 w-16 text-center">Packing</th>
                    <th className="p-2 w-16 text-right">MRP (₹)</th>
                    <th className="p-2 w-16 text-center">Disc %</th>
                    <th className="p-2 w-16 text-right">Rate (₹)</th>
                    <th className="p-2 w-16 text-center">Qty</th>
                    <th className="p-2 w-20 text-right">Amount (₹)</th>
                    <th className="p-2 w-10 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.length > 0 ? (
                    items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 text-center text-slate-500 font-mono">{idx + 1}</td>
                        <td className="p-2 font-semibold text-slate-900">
                          {it.name}
                        </td>
                        <td className="p-2 text-center text-slate-600">{it.pack_size || 'Box'}</td>
                        <td className="p-2 text-right text-slate-500 font-mono">
                          ₹{it.original_price}
                        </td>
                        <td className="p-2 text-center text-red-600 font-bold">
                          {it.discount_percent || 75}%
                        </td>
                        <td className="p-2 text-right font-bold text-slate-900 font-mono">
                          ₹{it.offer_price}
                        </td>
                        <td className="p-2 text-center font-bold font-mono">
                          <span className="print-only">{it.quantity}</span>
                          <div className="no-print flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleItemQtyChange(idx, -1)}
                              className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{it.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleItemQtyChange(idx, 1)}
                              className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-2 text-right font-black text-slate-900 font-mono">
                          ₹{it.total}
                        </td>
                        <td className="p-2 text-center no-print">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Remove Cracker"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-400 italic">
                        No crackers added to this bill yet. Select crackers from above to populate the bill.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTALS & SUMMARY SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 border-t-2 border-slate-800 pt-4 mb-4 text-xs">
              
              {/* Left Column: UPI Info on the Bill */}
              <div className="sm:col-span-7 space-y-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment Details (GPay / PhonePe / UPI)</span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-0.5">
                    <div>GPay / PhonePe / Paytm: <strong className="font-mono text-slate-900 font-bold">8939910664</strong></div>
                    <div>UPI ID: <strong className="font-mono text-slate-900 font-bold">8939910664@icici</strong></div>
                    <div className="text-[10px] text-slate-500 pt-0.5">Please share payment screenshot for instant dispatch.</div>
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
                  <span>Festive Discount (-75%):</span>
                  <span className="font-mono">-₹{Math.round(discountSavings)}</span>
                </div>

                <div className="flex justify-between text-slate-800 font-semibold border-t border-slate-200 pt-1">
                  <span>Net Items Amount:</span>
                  <span className="font-mono">₹{Math.round(netItemsTotal)}</span>
                </div>

                {/* Packaging & Delivery Controls */}
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
                  <div className="print-only text-[11px] text-slate-600 space-y-0.5">
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
        <div className="no-print bg-midnight-900 border-t border-slate-800 p-3 px-6 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Items in bill: <strong className="text-white">{items.length}</strong> • Total Value: <strong className="text-festive-gold font-mono text-sm">₹{grandTotal}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print A4 Invoice</span>
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow"
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
