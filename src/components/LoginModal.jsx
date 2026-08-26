import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { loginApi, registerApi } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, theme }) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [unit, setUnit] = useState('Block B - 402');
  const [role, setRole] = useState('Resident'); // 'Resident' or 'Admin'

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Register API Call to SQLite database
        const res = await registerApi({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || '+91 98290 12345',
          unit,
          role
        });

        onLoginSuccess(res.user);
        onClose();
      } else {
        // Login API Call to SQLite database
        const res = await loginApi(email.trim(), password);
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setError('');
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);

    try {
      const res = await loginApi(demoEmail, demoPassword);
      onLoginSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className={`w-12 h-12 rounded-2xl ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} flex items-center justify-center mx-auto shadow-sm`}>
            {isRegister ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRegister ? 'Resident Registration' : 'Resident Portal Login'}
          </h3>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Create your resident profile in Jaipur SQLite database'
              : 'Sign in to access your maintenance billing desk & gallery'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (+91)
                </label>
                <input
                  type="text"
                  placeholder="+91 98290 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Flat Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none font-semibold"
                  >
                    <option value="Block A - 102">Block A - 102 (Delayed Demo)</option>
                    <option value="Block B - 402">Block B - 402 (Pending Demo)</option>
                    <option value="Block C - 301">Block C - 301 (Given Demo)</option>
                    <option value="Block D - 204">Block D - 204 (Given Demo)</option>
                    <option value="Block A - 501">Block A - 501</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    User Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none font-semibold"
                  >
                    <option value="Resident">Flat Resident</option>
                    <option value="Admin">Society Admin</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. john@horizon.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl ${theme.buttonBg} text-white font-extrabold text-sm shadow-md transition-all mt-2`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating with Database...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{isRegister ? 'Create Resident Account' : 'Sign In To Portal'}</span>
              </>
            )}
          </button>

        </form>

        {/* Quick 1-Click Demo Accounts */}
        {!isRegister && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              1-Click Demo Accounts (SQLite DB)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleDemoLogin('john@horizon.com', 'password123')}
                className="px-2 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] text-center"
              >
                John (Pending)
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('amit@horizon.com', 'password123')}
                className="px-2 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 text-[11px] text-center"
              >
                Amit (Delayed)
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@horizon.com', 'password123')}
                className="px-2 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[11px] text-center"
              >
                Sarah (Admin)
              </button>
            </div>
          </div>
        )}

        {/* Toggle Sign In / Register */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {isRegister ? 'Already registered?' : 'New resident in society?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className={`font-bold ${theme.highlightText} hover:underline ml-1`}
          >
            {isRegister ? 'Sign In Here' : 'Register Flat Account'}
          </button>
        </div>

      </div>
    </div>
  );
}
