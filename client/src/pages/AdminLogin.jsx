import React, { useState } from 'react';
import { Lock, User, Key, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../utils/api';

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.adminLogin({ username, password });
      localStorage.setItem('sjc_admin_token', data.token);
      localStorage.setItem('sjc_admin_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-festive-red/20 blur-3xl rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-festive-gold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-festive-red via-festive-amber to-festive-gold p-0.5 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-midnight-950 rounded-full flex items-center justify-center text-3xl">
              🪔
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-poster text-gold-gradient">
            SRI JEYAM CRACKERS
          </h2>
          <p className="text-xs uppercase tracking-widest text-amber-300 font-bold mt-1">
            Store Owner Admin Portal
          </p>
        </div>

        <div className="mt-8 bg-midnight-900/90 border border-festive-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-950 border border-slate-700 focus:border-festive-gold text-white text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-950 border border-slate-700 focus:border-festive-gold text-white text-xs outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-festive-red to-festive-red-light hover:brightness-110 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-festive-red/40 border border-festive-gold/40 flex items-center justify-center gap-2 transition-all mt-4"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-festive-yellow" />
                  <span>LOGIN TO ADMIN DASHBOARD</span>
                </>
              )}
            </button>
          </form>

          {/* Helper credentials hint for the shop owner */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <div className="bg-midnight-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-amber-400 font-bold block">Default Credentials:</span>
              <div className="font-mono text-xs text-slate-300">
                User: <span className="text-white font-bold">admin</span> | Pass: <span className="text-white font-bold">srijeyam@admin2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
