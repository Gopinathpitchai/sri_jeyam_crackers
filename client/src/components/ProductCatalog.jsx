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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Sivakasi Direct Wholesale & Retail</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-poster text-slate-900">
          Diwali Crackers <span className="text-red-600">Price Catalog</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2">
          Enjoy <strong className="text-red-600 font-bold">FLAT {products[0]?.discount_percent || 75}% OFF</strong> on every single cracker. Genuine Sivakasi quality crackers with maximum burst, sparkle, and complete safety.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search crackers (e.g., Sparklers, 28 Giant, Flower Pots, Rockets)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 text-slate-900 placeholder-slate-400 text-sm outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 px-2 py-1"
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
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md border border-red-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
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
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md border border-red-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
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
            const offerPrice = parseFloat(product.offer_price !== undefined ? product.offer_price : Math.round(origPrice * 0.25));
            const discountPct = product.discount_percent !== undefined 
              ? product.discount_percent 
              : (origPrice > 0 ? Math.round((1 - offerPrice / origPrice) * 100) : 75);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {product.category}
                    </span>
                    <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      {discountPct}% OFF
                    </span>
                  </div>

                  {/* Product Icon / Image - Click to view in big size */}
                  <div 
                    onClick={() => setViewingProduct(product)}
                    className="w-full h-40 bg-slate-50 rounded-xl flex items-center justify-center mb-4 border border-slate-100 group-hover:border-amber-400/50 transition-all relative overflow-hidden cursor-pointer shadow-xs"
                    title="Click to view large picture & details"
                  >
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/sparklers.jpg'; }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2">
                        <span className="text-5xl filter drop-shadow(0 2px 8px rgba(245,158,11,0.5)) group-hover:scale-110 transition-transform duration-300">
                          ✨🧨
                        </span>
                        <span className="text-[11px] text-amber-700 font-semibold mt-1">Sri Jeyam Quality</span>
                      </div>
                    )}

                    {/* View Big Overlay Hint */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-white text-slate-900 font-bold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform border border-slate-200">
                        <ZoomIn className="w-3.5 h-3.5 text-red-600" />
                        <span>View Big</span>
                      </span>
                    </div>

                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200 shadow-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Details - Click to open details */}
                  <h3 
                    onClick={() => setViewingProduct(product)}
                    className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-1 cursor-pointer"
                    title="Click to view large picture & details"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Packing: <span className="text-slate-800 font-medium">{product.pack_size || '1 Box'}</span>
                  </p>

                  {/* Pricing Matrix */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-400 line-through mr-2 font-mono">
                          MRP: ₹{origPrice}
                        </span>
                        <div className="text-xl font-black text-red-600 font-mono">
                          ₹{offerPrice}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                          Save ₹{origPrice - offerPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Quantity & Add to Cart */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => handleQtyChange(product.id, -1)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      disabled={!product.in_stock}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-slate-900">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(product.id, 1)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow active:scale-95 border border-red-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-amber-200" />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Catalog State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-lg">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 p-1 mx-auto mb-4 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl diya-glow animate-flicker">🪔</span>
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-poster text-slate-900 mb-3">
            Diwali 2026 Price List Is Being Updated!
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
            Welcome to <strong className="text-red-700">Sri Jeyam Crackers</strong>! Our complete fresh inventory with <strong className="text-red-600">Flat 75% Diwali Discount</strong> will be updated in the catalog.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
            <a
              href="tel:6380115587"
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-600 hover:text-white transition-all font-bold text-sm shadow-xs"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>Call: 6380115587</span>
            </a>
            <a
              href="tel:9363243938"
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-600 hover:text-white transition-all font-bold text-sm shadow-xs"
            >
              <Phone className="w-4 h-4 text-amber-500" />
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
