import React, { useState } from 'react';
import { Phone, ShoppingCart, Search, Flame, Sparkles, ShieldCheck, Lock, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenTrack, onNavigateHome, discountPercent = 75 }) {
  const { totalItems, total, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm backdrop-blur-md bg-white/95 border-b border-slate-200">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-1.5 px-4 text-xs sm:text-sm font-semibold flex flex-wrap items-center justify-between border-b border-amber-300/40 shadow-xs">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-4 h-4 text-amber-200 animate-sparkle" />
          <span>DIWALI SPECIAL MEGA OFFER: <strong className="text-amber-200 underline decoration-wavy">FLAT {discountPercent}% OFF</strong> ON ALL CRACKERS!</span>
          <Sparkles className="w-4 h-4 text-amber-200 animate-sparkle" />
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs">
          <span>📞 Contact & Orders:</span>
          <a href="tel:6380115587" className="hover:text-amber-200 font-mono transition-colors font-bold">6380115587</a>
          <span>/</span>
          <a href="tel:9363243938" className="hover:text-amber-200 font-mono transition-colors font-bold">9363243938</a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl diya-glow">🪔</span>
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-poster tracking-wide text-red-700 group-hover:text-red-800 transition-all">
              SRI JEYAM CRACKERS
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <span>Sivakasi Quality Wholesale & Retail</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
          <button 
            onClick={onNavigateHome}
            className="hover:text-red-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Home
          </button>
          <a 
            href="#catalog"
            className="hover:text-red-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Crackers Catalog
          </a>
          <a 
            href="#offers"
            className="hover:text-red-600 transition-colors py-1 relative text-red-600 flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full border border-red-200"
          >
            <Flame className="w-4 h-4 text-red-600 animate-pulse" />
            <span>{discountPercent}% Special Offer</span>
          </a>
          <button 
            onClick={onOpenTrack}
            className="hover:text-red-600 transition-colors py-1 flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Call */}
          <a
            href="tel:6380115587"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-600 hover:text-white transition-all text-xs font-bold shadow-xs"
            title="Call to Order"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>6380115587</span>
          </a>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white font-bold shadow-md hover:shadow-lg hover:shadow-red-600/25 hover:brightness-105 active:scale-95 transition-all border border-amber-300"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
            <span className="hidden sm:inline text-xs font-bold tracking-wider">CART</span>
            {totalItems > 0 && (
              <span className="bg-amber-300 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full shadow animate-bounce">
                {totalItems}
              </span>
            )}
            {total > 0 && (
              <span className="hidden md:inline font-mono text-xs text-amber-100 border-l border-white/20 pl-2">
                ₹{total}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 text-center">
            <a 
              href="tel:6380115587"
              className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> 6380115587
            </a>
            <a 
              href="tel:9363243938"
              className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> 9363243938
            </a>
          </div>
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <button 
              onClick={() => { onNavigateHome(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Home
            </button>
            <a 
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Crackers Catalog
            </a>
            <a 
              href="#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg bg-red-50 text-red-700 font-bold flex items-center gap-1.5"
            >
              🔥 Flat {discountPercent}% OFF Offer
            </a>
            <button 
              onClick={() => { onOpenTrack(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-red-600" /> Track My Order
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
