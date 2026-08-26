import React, { useState } from 'react';
import { 
  CreditCard, CheckCircle2, QrCode, ShieldCheck, 
  Clock, Lock, Printer, Check, X, RefreshCw, FileText,
  Shield, LogIn, Cpu, RotateCcw
} from 'lucide-react';

export default function MaintenancePayment({ currentBill, payments, onCompletePayment, onResetPayment, user, onOpenLogin, theme }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('RAZORPAY'); // RAZORPAY, NTTDATA, UPI, CARD, NETBANKING
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Form Fields
  const [upiId, setUpiId] = useState('resident@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('123');

  // Razorpay / NTT Data API simulated fields
  const [razorpayPhone, setRazorpayPhone] = useState(user ? (user.phone || '+91 98290 12345') : '+91 98290 12345');
  const [nttBank, setNttBank] = useState('HDFC Bank');

  const isBillPaid = currentBill.status === 'PAID';

  const handleStartPayment = () => {
    if (!user) {
      onOpenLogin();
      return;
    }
    setShowPaymentModal(true);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);

      let methodString = '';
      let txnIdPrefix = 'TXN-2026-';

      if (selectedMethod === 'RAZORPAY') {
        methodString = `Razorpay API (pay_Rzp_${Math.floor(100000 + Math.random() * 900000)})`;
        txnIdPrefix = 'RZP-';
      } else if (selectedMethod === 'NTTDATA') {
        methodString = `NTT Data Gateway (${nttBank} - Atom Paynimo)`;
        txnIdPrefix = 'NTT-';
      } else if (selectedMethod === 'UPI') {
        methodString = `UPI (${upiId})`;
      } else if (selectedMethod === 'CARD') {
        methodString = 'Credit Card (Visa ending 8912)';
      } else {
        methodString = 'NetBanking (HDFC)';
      }

      const txnRecord = {
        id: txnIdPrefix + Math.floor(1000 + Math.random() * 9000),
        month: currentBill.month,
        amount: currentBill.totalAmount,
        breakdown: {
          flatMaintenance: 2400,
          waterCharges: 450,
          clubhouse: 350,
          sinkingFund: 300
        },
        date: new Date().toISOString().split('T')[0],
        status: 'PAID',
        method: methodString,
        receiptNo: 'REC-2026-' + Math.floor(10000 + Math.random() * 90000),
        unit: user ? user.unit : currentBill.unit
      };

      onCompletePayment(txnRecord);
    }, 1800);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setProcessing(false);
  };

  // IF NOT LOGGED IN -> SHOW CLEAN AUTH-GATED LOCK SCREEN
  if (!user) {
    return (
      <section id="maintenance" className="py-20 bg-white text-slate-800 relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs font-semibold uppercase tracking-wider`}>
              <Lock className={`w-4 h-4 ${theme.iconColor}`} />
              <span>Resident Authentication Required</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Maintenance Payment & Billing Portal
            </h2>
            <p className="text-slate-600 text-sm">
              Society maintenance dues and itemized charge statements are protected for authorized residents.
            </p>
          </div>

          {/* Locked Card Banner */}
          <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className={`w-16 h-16 rounded-2xl ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} flex items-center justify-center mx-auto shadow-sm`}>
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl font-extrabold text-slate-900">
                Please Sign In To Access Your Billing Statement
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Log in with your resident or flat owner account to inspect monthly breakdown charges, pay maintenance dues via <strong>Razorpay</strong>, <strong>NTT Data Gateway</strong>, or <strong>UPI</strong>, and view full payment transaction receipts.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenLogin}
                className={`flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl ${theme.buttonBg} text-white font-extrabold text-sm shadow-md transition-all transform hover:scale-105`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In To Pay Dues</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className={`w-4 h-4 ${theme.iconColor}`} /> Razorpay & NTT Data Gateways Integrated
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className={`w-4 h-4 ${theme.iconColor}`} /> 256-Bit Banking Security
              </span>
            </div>
          </div>

        </div>
      </section>
    );
  }

  // IF LOGGED IN -> FULL INTERACTIVE PAYMENT PORTAL
  return (
    <section id="maintenance" className="py-20 bg-white text-slate-800 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs font-semibold uppercase tracking-wider`}>
            <CreditCard className={`w-4 h-4 ${theme.iconColor}`} />
            <span>Digital Payment Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Society Maintenance & Dues Management
          </h2>
          <p className="text-slate-600 text-sm">
            Instant online bill settlement with zero extra transaction fees, integrated Razorpay & NTT Data gateways, instant automated receipts, and full audit logs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Current Active Dues Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Current Statement
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {currentBill.month}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                    <span>Unit: <strong className="text-slate-900">{user ? user.unit : currentBill.unit}</strong></span>
                    <span>•</span>
                    <span>Due Date: <strong className="text-amber-700 font-bold">{currentBill.dueDate}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isBillPaid ? (
                    <span className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} text-xs font-bold`}>
                      <CheckCircle2 className={`w-4 h-4 ${theme.iconColor}`} />
                      <span>PAID & CLEARED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>PAYMENT PENDING</span>
                    </span>
                  )}

                  {isBillPaid && (
                    <button
                      onClick={onResetPayment}
                      title="Reset Demo Dues Status back to Unpaid Pending"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Charge Itemization */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Itemized Charge Breakdown
                </h4>
                
                <div className="space-y-2 text-sm">
                  {currentBill.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-200/70">
                      <span className="text-slate-700">{item.item}</span>
                      <span className="font-semibold text-slate-900">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Dues Calculation */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Total Amount Payable</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    ₹{currentBill.totalAmount.toLocaleString()}
                  </span>
                </div>

                {!isBillPaid ? (
                  <button
                    onClick={handleStartPayment}
                    className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r ${theme.gradientBtn} text-white font-extrabold text-sm shadow-md transition-all transform hover:scale-105`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Pay ₹{currentBill.totalAmount} Now</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      disabled
                      className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed border border-slate-200"
                    >
                      <CheckCircle2 className={`w-4 h-4 ${theme.iconColor}`} />
                      <span>Bill Settled</span>
                    </button>
                    <button
                      onClick={onResetPayment}
                      className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Dues</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Safe Payment Guarantee Footer */}
              <div className="pt-2 flex items-center justify-center space-x-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <Lock className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                  <span>Razorpay & NTT Data API Verified</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Transaction History Log */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className={`w-5 h-5 ${theme.iconColor}`} />
                  Payment History & Receipts
                </h3>
                <span className="text-xs text-slate-500 font-medium">{payments.length} Records</span>
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No payment history recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((txn) => (
                    <div
                      key={txn.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all flex items-center justify-between shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{txn.month}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-extrabold ${theme.badgeBg} ${theme.badgeText} rounded border ${theme.badgeBorder}`}>
                            {txn.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {txn.date} • {txn.method}
                        </div>
                        <div className="text-xs font-mono text-slate-400">{txn.id}</div>
                      </div>

                      <div className="text-right space-y-2">
                        <div className="text-base font-extrabold text-slate-900">
                          ₹{txn.amount.toLocaleString()}
                        </div>
                        <button
                          onClick={() => setSelectedReceipt(txn)}
                          className={`inline-flex items-center space-x-1 text-xs ${theme.highlightText} font-bold hover:underline`}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Simulated Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${theme.badgeBg} ${theme.badgeText} flex items-center justify-center font-bold`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Grand Horizon PayGateway</h3>
                  <p className="text-xs text-slate-500">Settling dues for {currentBill.month}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!paymentSuccess ? (
              <form onSubmit={handleProcessPayment} className="space-y-6">
                
                {/* Method Selector Tabs with Razorpay & NTT Data */}
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('RAZORPAY')}
                    className={`py-2 px-1 rounded-lg transition-all text-[11px] font-bold ${
                      selectedMethod === 'RAZORPAY'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Razorpay
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('NTTDATA')}
                    className={`py-2 px-1 rounded-lg transition-all text-[11px] font-bold ${
                      selectedMethod === 'NTTDATA'
                        ? 'bg-indigo-900 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    NTT Data
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`py-2 px-1 rounded-lg transition-all text-[11px] font-bold ${
                      selectedMethod === 'UPI'
                        ? `${theme.buttonBg} text-white`
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    UPI / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('CARD')}
                    className={`py-2 px-1 rounded-lg transition-all text-[11px] font-bold ${
                      selectedMethod === 'CARD'
                        ? `${theme.buttonBg} text-white`
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Card
                  </button>
                </div>

                {/* RAZORPAY GATEWAY VIEW */}
                {selectedMethod === 'RAZORPAY' && (
                  <div className="space-y-4 bg-blue-50/50 p-4 border border-blue-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-blue-900 text-base tracking-tight">Razorpay</span>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded">Checkout SDK</span>
                      </div>
                      <span className="text-[10px] text-blue-700 font-mono font-semibold">Key: rzp_live_GH2026</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Resident Phone Number (Razorpay OTP)</label>
                        <input
                          type="text"
                          value={razorpayPhone}
                          onChange={(e) => setRazorpayPhone(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                        />
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-blue-200 text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Order ID:</span>
                          <span className="font-mono text-blue-900 font-bold">order_Rzp_2026_{Math.floor(1000 + Math.random()*9000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account:</span>
                          <span className="font-bold text-slate-800">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NTT DATA GATEWAY VIEW */}
                {selectedMethod === 'NTTDATA' && (
                  <div className="space-y-4 bg-indigo-50/50 p-4 border border-indigo-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-5 h-5 text-indigo-900" />
                        <span className="font-extrabold text-indigo-950 text-base tracking-tight">NTT Data</span>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-950 text-white rounded">Atom Paynimo</span>
                      </div>
                      <span className="text-[10px] text-indigo-800 font-mono font-semibold">Merchant: NTT_MCH_GH8812</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Select Bank Gateway Direct Route</label>
                        <select
                          value={nttBank}
                          onChange={(e) => setNttBank(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-indigo-300 rounded-xl text-slate-900 focus:outline-none font-medium"
                        >
                          <option>HDFC Bank Direct NetBanking</option>
                          <option>ICICI Bank Retail Gateway</option>
                          <option>State Bank of India (SBI) Corporate</option>
                          <option>Axis Bank Direct API</option>
                          <option>Kotak Mahindra Bank Online</option>
                        </select>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-indigo-200 text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>NTT Txn Ref:</span>
                          <span className="font-mono text-indigo-900 font-bold">NTT_ATOM_{Math.floor(100000 + Math.random()*900000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Checksum:</span>
                          <span className="font-mono text-xs text-indigo-700">SHA-512 Encrypted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI VIEW */}
                {selectedMethod === 'UPI' && (
                  <div className="space-y-4 text-center">
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl inline-block shadow-sm">
                      <QrCode className="w-36 h-36 text-slate-900 mx-auto" />
                      <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mt-1">
                        Scan with GPay / PhonePe / Paytm
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Or enter UPI Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-center text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* CARD VIEW */}
                {selectedMethod === 'CARD' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cardholder Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          CVV Security Code
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Amount Summary */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Paying Maintenance Bill:</span>
                  <span className={`text-xl font-extrabold ${theme.highlightText}`}>₹{currentBill.totalAmount}</span>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl ${
                    selectedMethod === 'RAZORPAY'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : selectedMethod === 'NTTDATA'
                      ? 'bg-indigo-950 hover:bg-slate-900 text-white'
                      : `${theme.buttonBg} text-white`
                  } font-extrabold text-sm shadow-md transition-all`}
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing with {selectedMethod}...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize ₹{currentBill.totalAmount} via {selectedMethod}</span>
                    </>
                  )}
                </button>

              </form>
            ) : (
              /* Success Screen */
              <div className="text-center py-6 space-y-5 animate-fade-in">
                <div className={`w-16 h-16 rounded-full ${theme.badgeBg} ${theme.badgeText} flex items-center justify-center mx-auto border ${theme.badgeBorder}`}>
                  <Check className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-2xl font-extrabold text-slate-900">Payment Successful!</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Maintenance dues for {currentBill.month} settled via {selectedMethod}. Official receipt generated.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gateway API Status:</span>
                    <span className="font-bold text-emerald-600">CONFIRMED 200 OK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-bold text-slate-900">₹{currentBill.totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className={`w-full py-3 rounded-xl ${theme.buttonBg} text-white font-bold text-sm`}
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl space-y-6 relative border border-slate-200">
            
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center border-b border-slate-200 pb-4 space-y-1">
              <h3 className="text-xl font-bold text-slate-900">GRAND HORIZON CO-OP HOUSING SOCIETY</h3>
              <p className="text-xs text-slate-500">Plot 45-A, Ajmer Road, Vaishali Nagar, Jaipur, Rajasthan - 302021</p>
              <span className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold ${theme.badgeBg} ${theme.badgeText} rounded border ${theme.badgeBorder}`}>
                {selectedReceipt.receiptNo}
              </span>
            </div>

            {/* Meta Table */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Resident Unit:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Billing Period:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.month}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Payment Date:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Payment Mode:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.method}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 flex justify-between">
                <span>Charge Particulars</span>
                <span>Amount (₹)</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Flat Maintenance Fee</span>
                  <span>₹2,400</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Charges</span>
                  <span>₹400</span>
                </div>
                <div className="flex justify-between">
                  <span>Clubhouse Maintenance</span>
                  <span>₹350</span>
                </div>
                <div className="flex justify-between">
                  <span>Sinking Fund Contribution</span>
                  <span>₹350</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>TOTAL PAID</span>
                  <span>₹{selectedReceipt.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer stamp */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
              <span>Computer Generated Jaipur Document</span>
              <span className={`${theme.highlightText} font-bold flex items-center gap-1`}>
                <CheckCircle2 className={`w-4 h-4 ${theme.iconColor}`} /> Authorized Stamp
              </span>
            </div>

            {/* Print Action Button */}
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF Receipt</span>
            </button>

          </div>
        </div>
      )}

    </section>
  );
}
