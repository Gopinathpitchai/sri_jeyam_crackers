import React, { useState } from 'react';
import { X, Search, Package, Clock, CheckCircle2, Truck, Phone, MessageSquare, Printer } from 'lucide-react';
import { api } from '../utils/api';

export default function OrderTrackModal({ isOpen, onClose, onViewBill }) {
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Packed':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Dispatched':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-8">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-black font-poster text-slate-900">
              Track Your Diwali Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Tracking Search Form */}
          <form onSubmit={handleTrack} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 text-xs outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs shadow-sm"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Results */}
          {orders && orders.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Found {orders.length} Order(s):
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black font-mono text-red-600">
                          {ord.order_number}
                        </span>
                        <div className="text-[11px] text-slate-500">
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
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                      {(ord.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700">
                          <span>{item.name} x {item.quantity}</span>
                          <span className="font-mono text-slate-500">₹{item.total || (item.offer_price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                        <span>Total Payable:</span>
                        <span className="text-red-600 font-mono">₹{ord.total_amount}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Delivery: {ord.address}, {ord.city}</span>
                      <div className="flex items-center gap-2">
                        {onViewBill && (
                          <button
                            onClick={() => onViewBill(ord)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>View Bill (பில்)</span>
                          </button>
                        )}
                        <a
                          href={`https://wa.me/916370115587?text=${encodeURIComponent(`Hello Sri Jeyam Crackers, checking status for my order ${ord.order_number}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <MessageSquare className="w-3 h-3" /> WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Help Footer */}
          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            <span>Need assistance with your order? Call: </span>
            <a href="tel:6380115587" className="text-red-600 font-bold hover:underline">6380115587</a>
            <span> / </span>
            <a href="tel:9363243938" className="text-red-600 font-bold hover:underline">9363243938</a>
          </div>
        </div>
      </div>
    </div>
  );
}
