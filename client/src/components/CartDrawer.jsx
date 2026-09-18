import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onProceedCheckout }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    total,
    totalItems
  } = useCart();

  if (!isCartOpen) return null;

  const handleWhatsAppQuickOrder = () => {
    let msg = `*🎇 DIWALI CRACKERS ORDER - SRI JEYAM CRACKERS 🎇*\n\n`;
    cartItems.forEach((item, i) => {
      const orig = item.product.original_price;
      const offer = item.product.offer_price || Math.round(orig * 0.5);
      msg += `${i + 1}. *${item.product.name}* (${item.product.pack_size || '1 Box'})\n`;
      msg += `   Qty: ${item.quantity} x ₹${offer} = ₹${offer * item.quantity}\n`;
    });
    msg += `\n--------------------------------\n`;
    msg += `*Total MRP:* ₹${subtotal}\n`;
    msg += `*Diwali 50% Discount:* -₹${discount}\n`;
    msg += `*🔥 Final Net Total:* ₹${total}\n`;
    msg += `--------------------------------\n`;
    msg += `Please confirm my order and share payment/delivery details!`;

    const url = `https://wa.me/916370115587?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-midnight-950 border-l border-festive-gold/40 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-midnight-900 border-b border-festive-gold/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-festive-yellow" />
              <h2 className="text-lg font-black font-poster text-white">
                Your Diwali Cart <span className="text-festive-yellow font-mono">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/80">
            {cartItems.length > 0 ? (
              cartItems.map(({ product, quantity }) => {
                const orig = parseFloat(product.original_price || 0);
                const offer = parseFloat(product.offer_price || orig * 0.5);
                const itemTotal = offer * quantity;

                return (
                  <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                      <p className="text-xs text-slate-400">
                        {product.pack_size || '1 Box'} • <span className="line-through text-slate-500">₹{orig}</span>{' '}
                        <strong className="text-festive-gold font-mono">₹{offer}</strong>
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold font-mono text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-16">
                      <div className="text-sm font-black text-white font-mono">₹{itemTotal}</div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3 text-3xl">
                  🛒
                </div>
                <h3 className="text-base font-bold text-white">Your Cart is Empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Add crackers from the catalog to enjoy Flat 50% Diwali discounts!
                </p>
              </div>
            )}
          </div>

          {/* Cart Footer / Bill Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-midnight-900 border-t border-festive-gold/30 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total MRP Value:</span>
                  <span className="line-through font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold bg-emerald-950/40 p-1.5 rounded border border-emerald-900/50">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-festive-yellow" />
                    Diwali 50% Discount Savings:
                  </span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black text-white pt-2 border-t border-slate-800">
                  <span>Net Payable Amount:</span>
                  <span className="text-festive-gold font-mono">₹{total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedCheckout();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-festive-red via-festive-red-light to-festive-red text-white font-extrabold text-sm shadow-lg shadow-festive-red/40 hover:brightness-110 active:scale-98 transition-all border border-festive-gold/40 flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO ONLINE ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppQuickOrder}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ORDER DIRECTLY VIA WHATSAPP</span>
                </button>

                <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400">
                  <span>Safe Diwali delivery from Sivakasi</span>
                  <button 
                    onClick={clearCart} 
                    className="text-red-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
