import React, { useState } from 'react';
import { Search, Plus, Minus, ShoppingCart, Sparkles, Filter, AlertCircle, Phone, MessageSquare, Lock, ZoomIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from './ProductDetailModal';

export default function ProductCatalog({ products = [], categories = [], onNavigateAdmin }) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState({});
  const [viewingProduct, setViewingProduct] = useState(null);

  const handleQtyChange = (productId, delta) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const getQty = (productId) => quantities[productId] || 1;

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festive-red/20 border border-festive-red/50 text-festive-red-light text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-festive-yellow" />
          <span>Sivakasi Direct Wholesale & Retail</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-poster text-white">
          Diwali Crackers <span className="text-gold-gradient">Price Catalog</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2">
          Enjoy <strong className="text-festive-yellow">FLAT 50% OFF</strong> on every single cracker. Genuine Sivakasi quality crackers with maximum burst, sparkle, and complete safety.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-midnight-900/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-festive-gold/30 shadow-2xl mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search crackers (e.g., Sparklers, 28 Giant, Flower Pots, Rockets)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-midnight-950 border border-slate-700 focus:border-festive-gold focus:ring-2 focus:ring-festive-gold/30 text-white placeholder-slate-400 text-sm outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-festive-red to-festive-red-light text-white shadow-lg shadow-festive-red/30 border border-festive-gold'
                : 'bg-midnight-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            🎆 All Crackers
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-gradient-to-r from-festive-red to-festive-red-light text-white shadow-lg shadow-festive-red/30 border border-festive-gold'
                  : 'bg-midnight-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid OR Clean Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const qty = getQty(product.id);
            const origPrice = parseFloat(product.original_price || 0);
            const offerPrice = parseFloat(product.offer_price || origPrice * 0.5);
            const discountPct = product.discount_percent || 50;

            return (
              <div
                key={product.id}
                className="bg-midnight-900/90 rounded-2xl border border-festive-gold/30 hover:border-festive-gold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-festive-gold/10 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                      {product.category}
                    </span>
                    <span className="bg-festive-red text-white text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                      {discountPct}% OFF
                    </span>
                  </div>

                  {/* Product Icon / Image - Click to view in big size */}
                  <div 
                    onClick={() => setViewingProduct(product)}
                    className="w-full h-40 bg-gradient-to-b from-slate-900 to-midnight-950 rounded-xl flex items-center justify-center mb-4 border border-slate-800 group-hover:border-festive-gold/60 transition-all relative overflow-hidden cursor-pointer shadow-md group-hover:shadow-festive-gold/20"
                    title="Click to view large picture & details"
                  >
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/sparklers.jpg'; }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2">
                        <span className="text-5xl filter drop-shadow(0 0 12px rgba(255,208,0,0.7)) group-hover:scale-110 transition-transform duration-300">
                          ✨🧨
                        </span>
                        <span className="text-[11px] text-amber-300 font-semibold mt-1">Sri Jeyam Quality</span>
                      </div>
                    )}

                    {/* View Big Overlay Hint */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-festive-gold text-slate-950 font-black text-xs shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform border border-amber-300">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>View Big</span>
                      </span>
                    </div>

                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-midnight-950/80 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider bg-red-950/80 px-3 py-1 rounded-full border border-red-800">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Details - Click to open details */}
                  <h3 
                    onClick={() => setViewingProduct(product)}
                    className="text-base font-bold text-white group-hover:text-festive-yellow transition-colors line-clamp-1 mb-1 cursor-pointer"
                    title="Click to view large picture & details"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    Packing: <span className="text-slate-200 font-medium">{product.pack_size || '1 Box'}</span>
                  </p>

                  {/* Pricing Matrix */}
                  <div className="bg-midnight-950/80 p-3 rounded-xl border border-slate-800/80 mb-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-400 line-through mr-2">
                          MRP: ₹{origPrice}
                        </span>
                        <div className="text-xl font-black text-festive-gold font-mono">
                          ₹{offerPrice}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                          Save ₹{origPrice - offerPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Quantity & Add to Cart */}
                <div className="p-4 bg-midnight-950/50 border-t border-slate-800/80 flex items-center gap-2">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                    <button
                      onClick={() => handleQtyChange(product.id, -1)}
                      className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      disabled={!product.in_stock}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-white">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(product.id, 1)}
                      className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      disabled={!product.in_stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product, qty)}
                    disabled={!product.in_stock}
                    className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                      product.in_stock
                        ? 'bg-gradient-to-r from-festive-red to-festive-red-light hover:brightness-110 text-white shadow-md active:scale-95 border border-festive-gold/30'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-festive-yellow" />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Catalog State (Zero Dummy Data Respecting User Instructions!) */
        <div className="bg-gradient-to-b from-midnight-900/90 to-midnight-950/95 rounded-3xl border-2 border-festive-gold/40 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-festive-red to-festive-gold p-1 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-midnight-950 rounded-full flex items-center justify-center">
              <span className="text-4xl diya-glow animate-flicker">🪔</span>
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-poster text-gold-gradient mb-3">
            Diwali 2026 Price List Is Being Updated!
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
            Welcome to <strong className="text-festive-yellow">Sri Jeyam Crackers</strong>! Our complete fresh inventory with <strong className="text-festive-red-light">Flat 50% Diwali Discount</strong> will be updated in the catalog.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
            <a
              href="tel:6380115587"
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-festive-red/20 border border-festive-red/50 text-white hover:bg-festive-red transition-all font-bold text-sm shadow-md"
            >
              <Phone className="w-4 h-4 text-festive-yellow" />
              <span>Call: 6380115587</span>
            </a>
            <a
              href="tel:9363243938"
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-festive-red/20 border border-festive-red/50 text-white hover:bg-festive-red transition-all font-bold text-sm shadow-md"
            >
              <Phone className="w-4 h-4 text-festive-yellow" />
              <span>Call: 9363243938</span>
            </a>
          </div>
        </div>
      )}

      {/* BIG PRODUCT QUICK VIEW MODAL */}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}
    </section>
  );
}
