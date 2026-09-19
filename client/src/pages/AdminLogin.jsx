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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/30 blur-3xl rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-amber-400 p-0.5 mx-auto mb-3 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl">
              🪔
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-poster text-slate-900">
            SRI JEYAM CRACKERS
          </h2>
          <p className="text-xs uppercase tracking-widest text-red-700 font-bold mt-1">
            Store Owner Admin Portal
          </p>
        </div>

        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-red-600 text-slate-900 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-red-600 text-slate-900 text-xs outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/20 border border-red-500 flex items-center justify-center gap-2 transition-all mt-4"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>LOGIN TO ADMIN DASHBOARD</span>
                </>
              )}
            </button>
          </form>

          {/* Helper credentials hint for the shop owner */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-amber-800 font-bold block">Default Credentials:</span>
              <div className="font-mono text-xs text-slate-700">
                User: <span className="text-slate-900 font-bold">admin</span> | Pass: <span className="text-slate-900 font-bold">srijeyam@admin2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
