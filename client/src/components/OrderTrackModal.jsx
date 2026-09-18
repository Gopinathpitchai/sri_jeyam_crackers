import React, { useState } from 'react';
import { X, Search, Package, Clock, CheckCircle2, Truck, Phone, MessageSquare } from 'lucide-react';
import { api } from '../utils/api';

export default function OrderTrackModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await api.trackOrders(query.trim());
      setOrders(data);
      if (!data || data.length === 0) {
        setError('No orders found for this phone number or order ID. Please check and try again.');
      }
    } catch (err) {
      setError(err.message || 'Error tracking orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Packed':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Dispatched':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-midnight-950 border border-festive-gold/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Header */}
        <div className="p-5 bg-midnight-900 border-b border-festive-gold/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-festive-yellow" />
            <h3 className="text-lg font-black font-poster text-white">
              Track Your Diwali Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Tracking Search Form */}
          <form onSubmit={handleTrack} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Enter your Registered Phone Number or Order ID (e.g. SJC-2026-XXXX):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or SJC-2026-..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-slate-700 focus:border-festive-gold text-white text-xs outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-festive-red to-festive-red-light hover:brightness-110 text-white font-bold text-xs shadow-md"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Results */}
          {orders && orders.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Found {orders.length} Order(s):
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-midnight-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black font-mono text-festive-gold">
                          {ord.order_number}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="bg-midnight-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                      {(ord.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300">
                          <span>{item.name} x {item.quantity}</span>
                          <span className="font-mono text-slate-400">₹{item.total || (item.offer_price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                        <span>Total Payable:</span>
                        <span className="text-festive-gold font-mono">₹{ord.total_amount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Delivery: {ord.address}, {ord.city}</span>
                      <a
                        href={`https://wa.me/916370115587?text=${encodeURIComponent(`Hello Sri Jeyam Crackers, checking status for my order ${ord.order_number}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp Shop
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Help Footer */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Need assistance with your order? Call: </span>
            <a href="tel:6380115587" className="text-festive-yellow font-bold hover:underline">6380115587</a>
            <span> / </span>
            <a href="tel:9363243938" className="text-festive-yellow font-bold hover:underline">9363243938</a>
          </div>
        </div>
      </div>
    </div>
  );
}
