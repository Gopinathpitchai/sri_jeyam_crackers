import React from 'react';
import { Phone, MessageSquare, MapPin, Sparkles, Lock, Heart } from 'lucide-react';

export default function Footer({ discountPercent = 75 }) {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 pt-12 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative z-10">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl diya-glow">🪔</span>
            <div className="text-2xl font-black font-poster text-red-700">
              SRI JEYAM CRACKERS
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            Celebrate this Diwali with happiness, lights & crackers! We bring authentic Sivakasi fireworks directly to your family at genuine wholesale rates with <strong className="text-red-600 font-bold">FLAT {discountPercent}% OFF</strong>.
          </p>
          <div className="text-xs text-amber-800 font-semibold italic">
            ✨ "Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!" ✨
          </div>
        </div>

        {/* Quick Contact & Orders (From Poster) */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
            Contact & Orders
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
              <a href="tel:6380115587" className="hover:text-red-600 font-mono font-bold text-slate-800">
                6380115587
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
              <a href="tel:9363243938" className="hover:text-red-600 font-mono font-bold text-slate-800">
                9363243938
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <a 
                href="https://wa.me/916370115587" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-700 font-semibold text-emerald-600"
              >
                WhatsApp Order Line
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links & Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <a href="#catalog" className="hover:text-red-600 transition-colors">
                🎆 Crackers Catalog
              </a>
            </li>
            <li>
              <a href="#safety" className="hover:text-red-600 transition-colors">
                🛡️ Safety Precautions
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 text-[11px] text-slate-400 text-center space-y-2">
        <p>
          <strong>Legal Disclaimer:</strong> As per Supreme Court directions, all crackers sold by Sri Jeyam Crackers comply with safe sound and emission standards. Orders placed online will be confirmed via phone/WhatsApp and delivered through authorized transport agencies.
        </p>
        <p className="text-slate-500">
          © {new Date().getFullYear()} Sri Jeyam Crackers. All Rights Reserved. Happy & Safe Diwali!
        </p>
      </div>
    </footer>
  );
}
