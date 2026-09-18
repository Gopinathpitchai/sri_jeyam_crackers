import React from 'react';
import { ShieldCheck, Flame, CheckCircle, XCircle, HeartHandshake } from 'lucide-react';

export default function SafetyTips() {
  return (
    <section id="safety" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-b from-midnight-900 to-midnight-950 rounded-3xl border border-festive-gold/30 p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Safe & Happy Celebrations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-poster text-white">
            Diwali Crackers <span className="text-gold-gradient">Safety Instructions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Sri Jeyam Crackers prioritizes your family's joy and safety. Please follow these essential precautions while bursting crackers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DO's */}
          <div className="bg-midnight-950/80 p-5 sm:p-6 rounded-2xl border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base mb-4">
              <CheckCircle className="w-5 h-5" />
              <span>DO's (Safe Practices)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Always burst crackers in an open ground or open terrace away from vehicles and dry grass.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Always light crackers using an agarbatti or sparkler from arm's length.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Keep a bucket of water and sand nearby in case of unexpected burns or spark drops.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Always supervise young children while they enjoy sparkles and flower pots.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Wear cotton clothes and footwear while lighting crackers.</span>
              </li>
            </ul>
          </div>

          {/* DONT's */}
          <div className="bg-midnight-950/80 p-5 sm:p-6 rounded-2xl border border-festive-red/30">
            <div className="flex items-center gap-2 text-festive-red-light font-bold text-base mb-4">
              <XCircle className="w-5 h-5" />
              <span>DON'Ts (Avoid Strictly)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-festive-red font-bold">✗</span>
                <span>Never light crackers holding them in your hand or lean over unburst crackers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-festive-red font-bold">✗</span>
                <span>Never re-ignite a cracker that failed to go off. Pour water on it safely.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-festive-red font-bold">✗</span>
                <span>Never carry loose crackers in your pockets or store near matches/gas cylinders.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-festive-red font-bold">✗</span>
                <span>Avoid wearing loose synthetic, silk, or nylon clothing near open flames.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-festive-red font-bold">✗</span>
                <span>Never burst crackers inside closed rooms or narrow staircases.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
