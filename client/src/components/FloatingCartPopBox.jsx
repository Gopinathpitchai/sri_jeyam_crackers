import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, 
  MessageSquare, Sparkles, Check, ChevronDown, ShoppingBag 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FloatingCartPopBox({ onProceedCheckout }) {
  const {
    cartItems,
    totalItems,
    subtotal,
    discount,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    lastAddedItem,
    isFloatingCartOpen,
    setIsFloatingCartOpen
  } = useCart();

  const [toastItem, setToastItem] = useState(null);
  const [bounce, setBounce] = useState(false);

  // When an item is added to cart, show the right-side bottom toast and pulse the floating widget
  useEffect(() => {
    if (lastAddedItem) {
      setToastItem(lastAddedItem);
      setBounce(true);
      const bounceTimer = setTimeout(() => setBounce(false), 800);
      const toastTimer = setTimeout(() => setToastItem(null), 4000);
      return () => {
        clearTimeout(bounceTimer);
        clearTimeout(toastTimer);
      };
    }
  }, [lastAddedItem]);

  const handleWhatsAppOrder = () => {
    let msg = `*🎇 DIWALI CRACKERS ORDER - SRI JEYAM CRACKERS 🎇*\n\n`;
    cartItems.forEach((item, i) => {
      const orig = parseFloat(item.product.original_price || 0);
      const offer = parseFloat(item.product.offer_price !== undefined ? item.product.offer_price : Math.round(orig * 0.25));
      msg += `${i + 1}. *${item.product.name}* (${item.product.pack_size || '1 Box'})\n`;
      msg += `   Qty: ${item.quantity} x ₹${offer} = ₹${offer * item.quantity}\n`;
    });
    msg += `\n--------------------------------\n`;
    msg += `*Total MRP:* ₹${subtotal}\n`;
    msg += `*Diwali Savings:* -₹${discount}\n`;
    msg += `*🔥 Net Total Payable:* ₹${total}\n`;
    msg += `--------------------------------\n`;
    msg += `Please confirm my order and share delivery details!`;

    const url = `https://wa.me/916370115587?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* 1. Add to Cart Toast Notification - Pops in at right side down corner */}
      {toastItem && (
        <div 
          className="fixed bottom-24 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] bg-white/95 border-2 border-red-500 rounded-2xl shadow-xl p-3.5 text-slate-900 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shrink-0 border border-amber-300 shadow-sm">
            {toastItem.product.image_url ? (
              <img 
                src={toastItem.product.image_url} 
                alt="" 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span className="text-xl">✨🧨</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" />
              <span>Added to Cart!</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {toastItem.product.name}
            </h4>
            <div className="text-[11px] text-slate-600 font-mono">
              Qty: {toastItem.quantity} • <span className="font-bold text-red-600">₹{(toastItem.product.offer_price !== undefined ? toastItem.product.offer_price : Math.round((toastItem.product.original_price || 0) * 0.25)) * toastItem.quantity}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={() => {
                setToastItem(null);
                setIsFloatingCartOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-sm transition-all"
            >
              View
            </button>
            <button
              onClick={() => setToastItem(null)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors text-center"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5 mx-auto" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Cart Pop Box & Toggle Button at Right-Side Down */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end">
          {/* Expanded Pop Box Card */}
          {isFloatingCartOpen && (
            <div 
              className="mb-3 w-[330px] sm:w-[380px] max-h-[75vh] bg-white/98 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Header */}
              <div className="p-3.5 bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-b border-amber-300/40 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🪔</span>
                  <div>
                    <h3 className="text-sm font-black font-poster tracking-wide">
                      Diwali Cart <span className="text-amber-200 font-mono">({totalItems} items)</span>
                    </h3>
                    <p className="text-[10px] text-amber-100">Wholesale direct rates applied</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFloatingCartOpen(false)}
                  className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors"
                  title="Minimize Pop Box"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[260px] divide-y divide-slate-100">
                {cartItems.map(({ product, quantity }) => {
                  const orig = parseFloat(product.original_price || 0);
                  const offer = parseFloat(product.offer_price !== undefined ? product.offer_price : Math.round(orig * 0.25));
                  const itemTotal = offer * quantity;

                  return (
                    <div key={product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2.5">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate" title={product.name}>
                          {product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500">
                          {product.pack_size || '1 Box'} • <span className="line-through text-slate-400">₹{orig}</span>{' '}
                          <strong className="text-red-600 font-mono">₹{offer}</strong>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono text-slate-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0 min-w-[50px]">
                        <div className="text-xs font-bold text-red-600 font-mono">
                          ₹{itemTotal}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Total MRP:</span>
                  <span className="line-through font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                  <span>Diwali Savings:</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Net Total:</span>
                  <span className="text-red-600 font-mono text-base">₹{total}</span>
                </div>

                {/* Buttons */}
                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => {
                      setIsFloatingCartOpen(false);
                      onProceedCheckout();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:brightness-110 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all border border-red-700"
                  >
                    <span>PROCEED TO ONLINE ORDER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>ORDER ON WHATSAPP</span>
                  </button>

                  <div className="flex justify-between items-center pt-0.5 text-[10px] text-slate-500">
                    <span>Direct from Sivakasi</span>
                    <button 
                      onClick={clearCart} 
                      className="text-red-600 hover:underline"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed Bottom-Right Floating Cart Button */}
          <button
            onClick={() => setIsFloatingCartOpen(prev => !prev)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-festive-red via-festive-red-light to-amber-600 text-white shadow-2xl border-2 border-festive-gold/90 hover:brightness-110 active:scale-95 transition-all group ${
              bounce ? 'scale-110 ring-4 ring-festive-gold/50 animate-bounce' : ''
            }`}
            style={{ boxShadow: '0 8px 30px rgba(198, 16, 33, 0.6), 0 0 20px rgba(255, 208, 0, 0.4)' }}
            title="Click to view Cart Pop Box"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-festive-yellow group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-festive-yellow text-slate-950 font-black text-[10px] flex items-center justify-center shadow font-mono">
                {totalItems}
              </span>
            </div>
            <div className="text-left flex flex-col leading-tight pr-1">
              <span className="text-[10px] uppercase font-bold text-amber-200">Diwali Cart</span>
              <span className="text-xs sm:text-sm font-black text-white font-mono">₹{total}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-festive-yellow text-xs font-bold">
              {isFloatingCartOpen ? '▼' : '▲'}
            </div>
          </button>
        </div>
      )}
    </>
  );
}
