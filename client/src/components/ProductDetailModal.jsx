import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingCart, Plus, Minus, Check, MessageSquare, 
  Sparkles, ShieldCheck, Flame, ZoomIn, Info, Share2
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const origPrice = parseFloat(product.original_price || 0);
  const discountPct = product.discount_percent || 75;
  const offerPrice = parseFloat(product.offer_price || Math.round(origPrice * (1 - discountPct / 100)));
  const savings = Math.max(0, origPrice - offerPrice);
  const totalItemCost = offerPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const msg = `Hello Sri Jeyam Crackers! 🎆\nI am interested in:\n*${product.name}*\nPacking: ${product.pack_size || 'Box'}\nNet Rate: ₹${offerPrice} (MRP: ₹${origPrice}, ${discountPct}% OFF)\nQuantity: ${quantity} box(es)\nTotal: ₹${totalItemCost}\n\nPlease confirm availability!`;
    window.open(`https://wa.me/916380115587?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden relative text-slate-900 flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200 shadow-md"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: BIG PRODUCT PICTURE DISPLAY */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-200">
          {/* Top badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-sm">
              {discountPct}% FESTIVE OFF
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
              {product.category}
            </span>
          </div>

          {/* Big Image Container with Zoom capability */}
          <div 
            className="w-full aspect-square max-h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group bg-white flex items-center justify-center cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
            title="Click to toggle zoom"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105'
                }`}
                onError={(e) => { e.target.onerror = null; e.target.src = '/images/sparklers.jpg'; }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <span className="text-7xl mb-2 filter drop-shadow(0 2px 8px rgba(245,158,11,0.5)) animate-pulse">
                  🧨✨
                </span>
                <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                  Sri Jeyam Crackers
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Sivakasi Premium Quality
                </span>
              </div>
            )}

            {/* Click to zoom hint */}
            {product.image_url && (
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-slate-900 border border-slate-200 text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 opacity-80 group-hover:opacity-100 pointer-events-none transition-opacity shadow-sm">
                <ZoomIn className="w-3.5 h-3.5 text-red-600" />
                <span>{isZoomed ? 'Zoom Out' : 'Zoom In'}</span>
              </div>
            )}

            {!product.in_stock && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                <span className="text-sm font-bold text-red-700 uppercase tracking-wider bg-red-50 px-4 py-1.5 rounded-full border border-red-200 shadow-sm">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Genuine Sivakasi Certified Green Crackers</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT DETAILS & PURCHASE CONTROLS */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-3">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{product.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-poster text-slate-900 leading-tight">
                {product.name}
              </h2>
              <div className="text-xs text-slate-500 mt-1">
                Packing Unit: <strong className="text-slate-900 font-medium">{product.pack_size || '1 Box'}</strong>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through mr-2 font-mono">
                    MRP: ₹{origPrice}
                  </span>
                  <div className="text-3xl font-black text-red-600 font-mono">
                    ₹{offerPrice}
                    <span className="text-xs text-slate-500 font-normal ml-1.5">/ {product.pack_size || 'Box'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs font-mono">
                    Save ₹{savings} ({discountPct}% OFF)
                  </span>
                </div>
              </div>
              
              <div className="text-[11px] text-amber-800 italic pt-1 border-t border-slate-200">
                ⭐ Sivakasi factory direct wholesale price applied
              </div>
            </div>

            {/* Product Highlights */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>Superior burst power and vibrant colors</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Lab tested safe fuse with standard delay</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Direct delivery available across Tamil Nadu & India</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions: Qty + Add to Cart + WhatsApp */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            {/* Quantity Selector & Item Total */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-semibold">Select Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-black text-slate-900 font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Line */}
            <div className="flex justify-between items-center text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span>Total Payable for {quantity} box(es):</span>
              <strong className="text-base text-red-600 font-mono">₹{totalItemCost}</strong>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart (₹{totalItemCost})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
