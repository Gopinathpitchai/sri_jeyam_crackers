import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageSquare, Phone, MapPin, Sparkles, ShoppingBag, ShieldCheck, ArrowRight, Printer, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';

export default function CheckoutModal({ isOpen, onClose, onViewBill }) {
  const { cartItems, subtotal, discount, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    whatsapp_number: '',
    address: '',
    city: '',
    pincode: '',
    delivery_notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Automatically reset completed order if modal opens with active cart items
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      setCompletedOrder(null);
      setError('');
    }
  }, [isOpen, cartItems.length]);

  const handleModalClose = () => {
    setCompletedOrder(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'phone_number' && !prev.whatsapp_number ? { whatsapp_number: value } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name.trim() || !formData.phone_number.trim() || !formData.address.trim() || !formData.city.trim()) {
      setError('Please fill all required fields: Name, Phone, Address, and City.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        ...formData,
        items: cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          category: item.product.category,
          pack_size: item.product.pack_size,
          original_price: item.product.original_price,
          offer_price: item.product.offer_price || Math.round(item.product.original_price * 0.5),
          quantity: item.quantity
        }))
      };

      const result = await api.placeOrder(orderPayload);
      setCompletedOrder(result);
      clearCart();

      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd000', '#c61021', '#ffaa00', '#ffffff']
      });
    } catch (err) {
      setError(err.message || 'Could not place order. Please try again or order on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppShareLink = () => {
    if (!completedOrder) return '#';
    let msg = `*🎇 NEW ORDER PLACED - SRI JEYAM CRACKERS 🎇*\n\n`;
    msg += `*Order ID:* ${completedOrder.order_number}\n`;
    msg += `*Customer:* ${completedOrder.customer_name}\n`;
    msg += `*Phone:* ${completedOrder.phone_number}\n`;
    msg += `*Address:* ${completedOrder.address}, ${completedOrder.city} - ${completedOrder.pincode}\n\n`;
    msg += `*Items Ordered:*\n`;
    (completedOrder.items || []).forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (${item.pack_size || '1 Box'}) x ${item.quantity} = ₹${item.total || (item.offer_price * item.quantity)}\n`;
    });
    msg += `\n*Total MRP:* ₹${completedOrder.subtotal}\n`;
    msg += `*Diwali 75% Savings:* -₹${completedOrder.discount}\n`;
    msg += `*🔥 Final Net Payable:* ₹${completedOrder.total_amount}\n\n`;
    msg += `Please confirm my order and send dispatch tracking details!`;

    return `https://wa.me/916370115587?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-8">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-b border-amber-300/40 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl diya-glow">🪔</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-poster text-white">
                {completedOrder ? 'Order Confirmed!' : 'Quick Diwali Checkout'}
              </h3>
              <p className="text-[11px] text-amber-200">
                {completedOrder ? 'Thank you for choosing Sri Jeyam Crackers' : 'No account needed • Fast Sivakasi direct delivery'}
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Success Screen */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Order Placed Successfully</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-red-600 mt-1">
                {completedOrder.order_number}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                A copy of your order has been saved. You can also track it anytime using this order ID.
              </p>
            </div>

            {/* Price Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700 text-left">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-slate-900">{completedOrder.customer_name} ({completedOrder.phone || completedOrder.phone_number})</span>
              </div>
              <div className="flex justify-between">
                <span>Total Crackers Items:</span>
                <span className="font-bold text-slate-900">{completedOrder.items?.length || 0} items</span>
              </div>
              <div className="flex justify-between">
                <span>Total MRP:</span>
                <span className="font-mono">₹{completedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Diwali Discount Savings:</span>
                <span>-₹{completedOrder.discount}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-red-600 font-mono">₹{completedOrder.total_amount}</span>
              </div>
            </div>

            {/* UPI Payment Details */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 text-left space-y-2 text-xs">
              <div className="text-amber-900 font-bold flex items-center justify-between">
                <span>💳 UPI Payment Details:</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-semibold">Instant UPI Available</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs text-slate-700 space-y-1 text-xs">
                <div className="font-bold text-amber-800">📱 GPay / PhonePe / Paytm</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] pt-0.5">
                  <div>UPI Number: <strong className="text-slate-900 font-mono font-bold">63801 15587</strong></div>
                  <div>UPI ID: <strong className="text-slate-900 font-mono font-bold">6380115587@upi</strong></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic text-center pt-1">
                Please share the payment screenshot on WhatsApp after paying.
              </p>
            </div>

            {/* Next Steps Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={getWhatsAppShareLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>CONFIRM ORDER ON WHATSAPP (RECOMMENDED)</span>
              </a>

              {/* View / Print Official Bill */}
              {onViewBill && completedOrder && (
                <button
                  onClick={() => onViewBill(completedOrder)}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Printer className="w-5 h-5" />
                  <span>GENERATE / PRINT BILL (ரசீது பில் பார்க்க)</span>
                </button>
              )}

              {/* Start New Order Button */}
              <button
                onClick={handleModalClose}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white font-black text-sm shadow-md hover:brightness-110 flex items-center justify-center gap-2 active:scale-98 transition-all border border-red-700"
              >
                <span>DONE & START NEXT ORDER (புதிய ஆர்டர் செய்க)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:6380115587"
                  className="py-2.5 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 font-bold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-red-600" /> Call: 6380115587
                </a>
                <button
                  onClick={handleModalClose}
                  className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Order Price Snapshot */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Total Items: </span>
                <span className="font-bold text-slate-900">{cartItems.length} items</span>
              </div>
              <div>
                <span className="text-slate-400 line-through mr-2 font-mono">MRP: ₹{subtotal}</span>
                <span className="font-black text-sm text-red-600 font-mono">Payable: ₹{total}</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 text-slate-900 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="10-digit mobile number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 text-slate-900 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  placeholder="For order updates & bill"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 text-slate-900 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  City / Town <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Chennai, Madurai, Sivakasi"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 text-slate-900 text-xs outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Delivery Address & Landmark <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows="2"
                  name="address"
                  placeholder="House / Door No, Street, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 text-slate-900 text-xs outline-none resize-none transition-all"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="e.g. 600001"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 text-slate-900 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Special Delivery Instructions
                </label>
                <input
                  type="text"
                  name="delivery_notes"
                  placeholder="e.g. Call before delivery"
                  value={formData.delivery_notes}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 text-slate-900 text-xs outline-none transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white font-extrabold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all border border-red-700 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>CONFIRM & PLACE ORDER (₹{total})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
