import React from 'react';
import { Phone, MessageSquare, MapPin, Sparkles, Lock, Heart } from 'lucide-react';

export default function Footer({ onNavigateAdmin }) {
  return (
    <footer className="bg-midnight-950 border-t-2 border-festive-gold/30 text-slate-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand & Tagline */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl diya-glow">🪔</span>
            <div className="text-2xl font-black font-poster text-gold-gradient">
              SRI JEYAM CRACKERS
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            Celebrate this Diwali with happiness, lights & crackers! We bring authentic Sivakasi fireworks directly to your family at genuine wholesale rates with <strong className="text-festive-yellow">FLAT 50% OFF</strong>.
          </p>
          <div className="text-xs text-amber-300 font-semibold italic">
            ✨ "Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!" ✨
          </div>
        </div>

        {/* Quick Contact & Orders (From Poster) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-festive-yellow">
            Contact & Orders
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-festive-gold flex-shrink-0" />
              <a href="tel:6380115587" className="hover:text-white font-mono font-bold text-slate-200">
                6380115587
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-festive-gold flex-shrink-0" />
              <a href="tel:9363243938" className="hover:text-white font-mono font-bold text-slate-200">
                9363243938
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a 
                href="https://wa.me/916370115587" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-300 font-semibold text-emerald-400"
              >
                WhatsApp Order Line
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links & Admin */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-festive-yellow">
            Quick Navigation
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <a href="#catalog" className="hover:text-festive-gold transition-colors">
                🎆 Crackers Catalog
              </a>
            </li>
            <li>
              <a href="#safety" className="hover:text-festive-gold transition-colors">
                🛡️ Safety Precautions
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 text-center space-y-2">
        <p>
          <strong>Legal Disclaimer:</strong> As per Supreme Court directions, all crackers sold by Sri Jeyam Crackers comply with safe sound and emission standards. Orders placed online will be confirmed via phone/WhatsApp and delivered through authorized transport agencies.
        </p>
        <p className="text-slate-400">
          © {new Date().getFullYear()} Sri Jeyam Crackers. All Rights Reserved. Happy & Safe Diwali!
        </p>
      </div>
    </footer>
  );
}
