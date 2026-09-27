import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, Lock, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
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
  const role = 'Flat Resident';

  // OTP Fields
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setError('');
    alert(`Mock OTP sent to +91 ${phone}! Please enter 1234 to verify.`);
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') {
      setOtpVerified(true);
      setError('');
    } else {
      setError('Invalid OTP. Please enter 1234.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (phone.length !== 10) {
        setError('Mobile number must be exactly 10 digits.');
        return;
      }
      if (!otpVerified) {
        setError('Please verify your mobile number with OTP first.');
        return;
      }
      if (!unit.trim()) {
        setError('Please enter your Flat Unit.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerApi({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: `+91 ${phone.trim()}`,
          unit: unit.trim(),
          role: 'Resident'
        });

        onLoginSuccess(res.user);
        onClose();
      } else {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative space-y-4 my-auto overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
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
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Test"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  MOBILE NUMBER (+91) *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    maxLength={10}
                    disabled={otpVerified}
                    placeholder="1234789514"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900 disabled:opacity-50 font-semibold"
                  />
                  {!otpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3.5 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-colors whitespace-nowrap"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  )}
                  {otpVerified && (
                    <div className="flex items-center justify-center px-3 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ENTER OTP (Try 1234)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="1234"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2.5 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    FLAT UNIT *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Block B - 402"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    USER ROLE *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Flat Resident"
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              required
              placeholder="Testing@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              PASSWORD *
            </label>
            <input
              type="password"
              required
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (isRegister && !otpVerified)}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl ${theme.buttonBg} text-white font-extrabold text-sm shadow-md transition-all mt-2 disabled:opacity-50`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating...</span>
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
        <div className="text-center text-xs text-slate-500 pt-1 border-t border-slate-100">
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
