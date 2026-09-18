import React from 'react';
import { Phone, MessageSquare, ShoppingCart, Sparkles, CheckCircle, ArrowDown, Flame } from 'lucide-react';

export default function HeroSection({ onExploreClick, onOpenCart }) {
  const whatsappUrl = `https://wa.me/916370115587?text=${encodeURIComponent('Hello Sri Jeyam Crackers! I would like to order Diwali crackers with Flat 50% discount.')}`;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Glow effects & festive background ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[450px] bg-radial from-festive-red/25 via-festive-gold/15 to-transparent blur-3xl pointer-events-none -z-10"></div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Hanging Lanterns Visual Accent */}
        <div className="flex justify-between items-start max-w-2xl mx-auto px-4 -mt-4 mb-2 pointer-events-none select-none">
          <div className="flex flex-col items-center animate-float">
            <div className="w-0.5 h-10 bg-amber-400/80"></div>
            <span className="text-3xl sm:text-4xl filter drop-shadow(0 0 12px rgba(255,196,0,0.8))">🏮</span>
          </div>
          <div className="flex flex-col items-center animate-float [animation-delay:1.5s]">
            <div className="w-0.5 h-10 bg-amber-400/80"></div>
            <span className="text-3xl sm:text-4xl filter drop-shadow(0 0 12px rgba(255,196,0,0.8))">🏮</span>
          </div>
        </div>

        {/* 1. Shop Arch Banner (From Poster) */}
        <div className="inline-block relative mb-4">
          <div className="relative px-6 sm:px-12 py-3 sm:py-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#b30f24] via-[#880816] to-[#59040d] border-4 border-[#ffd000] shadow-[0_0_40px_rgba(255,208,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.4)]">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black font-poster tracking-wider text-gold-3d uppercase">
              SRI JEYAM
            </div>
            <div className="text-3xl sm:text-5xl md:text-6xl font-black font-poster tracking-tight text-[#ffd000] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] -mt-1 sm:-mt-2">
              CRACKERS
            </div>
          </div>
        </div>

        {/* 2. Curved Ribbon Banner: DIWALI SPECIAL OFFER */}
        <div className="relative max-w-xl mx-auto my-3">
          <div className="ribbon-banner rounded-xl py-2 px-6 sm:px-10 flex items-center justify-center gap-3">
            <span className="text-2xl diya-glow animate-flicker">🪔</span>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black font-poster tracking-widest text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              DIWALI SPECIAL OFFER
            </h2>
            <span className="text-2xl diya-glow animate-flicker [animation-delay:0.7s]">🪔</span>
          </div>
        </div>

        {/* 3. Center Highlight: FLAT 50% OFF Starburst Poster Recreation */}
        <div className="relative my-6 sm:my-8 flex justify-center items-center">
          <div className="relative group cursor-pointer" onClick={onExploreClick}>
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-festive-yellow via-festive-gold to-festive-red blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-glow"></div>
            
            {/* Starburst Badge */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full starburst-badge flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300 p-4">
              <span className="text-xl sm:text-2xl font-black text-festive-red tracking-widest uppercase -mb-1 sm:-mb-2">
                FLAT
              </span>
              <div className="text-6xl sm:text-8xl font-black text-white font-poster leading-none tracking-tighter drop-shadow-[0_4px_8px_rgba(138,6,20,0.9)]" style={{ WebkitTextStroke: '3px #c61021' }}>
                50<span className="text-4xl sm:text-6xl">%</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-festive-red uppercase tracking-wider -mt-1">
                OFF
              </span>
              <div className="mt-1 bg-midnight-950 text-festive-yellow text-[10px] sm:text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest border border-festive-gold/60 shadow-md">
                Diwali 2026 Special
              </div>
            </div>
          </div>
        </div>

        {/* 4. Left & Right Poster Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto my-6 items-center">
          {/* Left Text */}
          <div className="bg-midnight-900/80 backdrop-blur-md p-4 rounded-2xl border border-festive-gold/30 text-center shadow-lg">
            <p className="text-sm sm:text-base font-semibold italic text-amber-200">
              ✨ "Celebrate this Diwali with happiness, lights & crackers!"
            </p>
          </div>

          {/* Center: Online Orders Available Badge (Exact poster feature) */}
          <div className="bg-gradient-to-r from-festive-red to-festive-red-dark p-3.5 rounded-2xl border-2 border-festive-gold shadow-[0_0_20px_rgba(229,34,51,0.5)] flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-midnight-950 flex items-center justify-center text-festive-yellow shadow-inner">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] uppercase font-bold text-amber-300 tracking-wider">Fast & Hassle-free</div>
              <div className="text-base sm:text-lg font-black text-white tracking-wide uppercase">ONLINE ORDERS AVAILABLE</div>
            </div>
          </div>

          {/* Right Highlights (Exact poster points) */}
          <div className="bg-midnight-900/80 backdrop-blur-md p-4 rounded-2xl border border-festive-gold/30 text-left space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200">
              <CheckCircle className="w-4 h-4 text-festive-gold flex-shrink-0" />
              <span>Huge collection of crackers available</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200">
              <CheckCircle className="w-4 h-4 text-festive-gold flex-shrink-0" />
              <span>Special Diwali discounts for all customers</span>
            </div>
          </div>
        </div>

        {/* 5. Contact / Order Ribbon (From Poster) */}
        <div className="my-6 max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-[#59040d] via-[#880816] to-[#59040d] border-2 border-[#ffd000] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="text-xs uppercase font-bold text-amber-300 tracking-widest mb-1">
            Contact / Order Now
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xl sm:text-2xl md:text-3xl font-black text-[#ffd000]">
            <a 
              href="tel:6380115587" 
              className="flex items-center gap-2 hover:text-white transition-colors bg-midnight-950/60 px-4 py-1.5 rounded-xl border border-amber-400/40"
            >
              <Phone className="w-5 h-5 text-festive-gold animate-bounce" />
              <span>6380115587</span>
            </a>
            <span className="text-amber-500 font-normal">/</span>
            <a 
              href="tel:9363243938" 
              className="flex items-center gap-2 hover:text-white transition-colors bg-midnight-950/60 px-4 py-1.5 rounded-xl border border-amber-400/40"
            >
              <Phone className="w-5 h-5 text-festive-gold" />
              <span>9363243938</span>
            </a>
          </div>
        </div>

        {/* 6. Tagline & Diwali Wish (From Poster) */}
        <div className="my-4">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold">
            ✨ Celebrate Diwali with More Crackers & More Savings! ✨
          </div>
          <div className="text-2xl sm:text-4xl font-black font-poster text-gold-gradient mt-2 tracking-widest uppercase">
            HAPPY DIWALI!
          </div>
        </div>

        {/* 7. Action CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-festive-red via-festive-red-light to-festive-red text-white font-extrabold text-base sm:text-lg shadow-[0_0_25px_rgba(229,34,51,0.6)] hover:brightness-110 active:scale-95 transition-all border-2 border-festive-gold flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-festive-yellow" />
            <span>BROWSE CATALOG & ORDER</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base sm:text-lg shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all border-2 border-emerald-400 flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span>ORDER ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </section>
  );
}
