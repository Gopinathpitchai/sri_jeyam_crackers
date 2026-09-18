import React, { useState } from 'react';
import { Phone, ShoppingCart, Search, Flame, Sparkles, ShieldCheck, Lock, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenTrack, onNavigateAdmin, onNavigateHome }) {
  const { totalItems, total, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-2xl backdrop-blur-md bg-midnight-950/95 border-b border-festive-gold/30">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-festive-red-dark via-festive-red to-festive-red-dark text-white py-1 px-4 text-xs sm:text-sm font-semibold flex flex-wrap items-center justify-between border-b border-festive-gold/40">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-4 h-4 text-festive-yellow animate-sparkle" />
          <span>DIWALI SPECIAL MEGA OFFER: <strong className="text-festive-yellow underline decoration-wavy">FLAT 50% OFF</strong> ON ALL CRACKERS!</span>
          <Sparkles className="w-4 h-4 text-festive-yellow animate-sparkle" />
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs">
          <span>📞 Contact & Orders:</span>
          <a href="tel:6380115587" className="hover:text-festive-yellow font-mono transition-colors">6380115587</a>
          <span>/</span>
          <a href="tel:9363243938" className="hover:text-festive-yellow font-mono transition-colors">9363243938</a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-festive-red via-festive-amber to-festive-gold p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-midnight-950 rounded-full flex items-center justify-center">
              <span className="text-2xl diya-glow">🪔</span>
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-poster tracking-wide text-gold-gradient group-hover:brightness-110 transition-all">
              SRI JEYAM CRACKERS
            </div>
            <div className="text-[10px] sm:text-xs text-amber-300/80 font-medium tracking-wider uppercase flex items-center gap-1">
              <span>Sivakasi Quality Wholesale & Retail</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-200">
          <button 
            onClick={onNavigateHome}
            className="hover:text-festive-gold transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-festive-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Home
          </button>
          <a 
            href="#catalog"
            className="hover:text-festive-gold transition-colors py-1 relative"
          >
            Crackers Catalog
          </a>
          <a 
            href="#offers"
            className="hover:text-festive-gold transition-colors py-1 relative text-festive-yellow flex items-center gap-1"
          >
            <Flame className="w-4 h-4 text-festive-red animate-pulse" />
            50% Special Offer
          </a>
          <button 
            onClick={onOpenTrack}
            className="hover:text-festive-gold transition-colors py-1 flex items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <Search className="w-3.5 h-3.5" />
            Track Order
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Call */}
          <a
            href="tel:6380115587"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-festive-red/20 border border-festive-red/60 text-festive-red-light hover:bg-festive-red hover:text-white transition-all text-xs font-bold shadow-md"
            title="Call to Order"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>6380115587</span>
          </a>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-festive-red to-festive-red-light text-white font-bold shadow-lg hover:shadow-festive-red/40 hover:brightness-110 active:scale-95 transition-all border border-festive-gold/40"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-festive-yellow" />
            <span className="hidden sm:inline text-xs font-bold tracking-wider">CART</span>
            {totalItems > 0 && (
              <span className="bg-festive-gold text-midnight-950 text-xs font-extrabold px-2 py-0.5 rounded-full shadow animate-bounce">
                {totalItems}
              </span>
            )}
            {total > 0 && (
              <span className="hidden md:inline font-mono text-xs text-yellow-100 border-l border-white/20 pl-2">
                ₹{total}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-midnight-900/98 border-b border-festive-gold/30 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            <a 
              href="tel:6380115587"
              className="p-2.5 rounded-lg bg-festive-red/20 border border-festive-red/50 text-xs font-bold text-festive-red-light flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> 6380115587
            </a>
            <a 
              href="tel:9363243938"
              className="p-2.5 rounded-lg bg-festive-red/20 border border-festive-red/50 text-xs font-bold text-festive-red-light flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> 9363243938
            </a>
          </div>
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-200">
            <button 
              onClick={() => { onNavigateHome(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded hover:bg-slate-800/60"
            >
              🏠 Home
            </button>
            <a 
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-slate-800/60"
            >
              🎆 Crackers Catalog
            </a>
            <a 
              href="#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-slate-800/60 text-festive-yellow flex items-center gap-1.5"
            >
              🔥 Flat 50% OFF Offer
            </a>
            <button 
              onClick={() => { onOpenTrack(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded hover:bg-slate-800/60 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-festive-gold" /> Track My Order
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
