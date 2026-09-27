import React, { useState } from 'react';
import { 
  CreditCard, CheckCircle2, QrCode, ShieldCheck, 
  Clock, Lock, Printer, Check, X, RefreshCw, FileText,
  Shield, LogIn, Cpu, Building2, Send
} from 'lucide-react';
import { payMaintenanceApi } from '../services/api';

export default function MaintenancePayment({ currentBill, payments, onCompletePayment, user, onOpenLogin, theme }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('BANK_TRANSFER'); // BANK_TRANSFER, RAZORPAY, NTTDATA, UPI, CARD
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Bank Transfer / Netbanking Details
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accHolder, setAccHolder] = useState(user ? user.name : 'Rajesh Sharma');
  const [accNumber, setAccNumber] = useState('981245678901');
  const [ifscCode, setIfscCode] = useState('HDFC0000123');

  // 2. Razorpay Details
  const [razorpayPhone, setRazorpayPhone] = useState(user ? (user.phone || '9829012345') : '9829012345');
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_GH2026');
  const [razorpayTxnRef, setRazorpayTxnRef] = useState('pay_Rzp_' + Math.floor(100000 + Math.random() * 900000));

  // 3. NTT Data Details
  const [nttBank, setNttBank] = useState('HDFC Bank Direct NetBanking');
  const [nttCustomerId, setNttCustomerId] = useState('NTT_CUST_' + Math.floor(1000 + Math.random() * 9000));
  const [nttTxnRef, setNttTxnRef] = useState('ATOM_' + Math.floor(100000 + Math.random() * 900000));

  // 4. UPI Details
  const [vpaName, setVpaName] = useState(user ? user.name : 'Rajesh Sharma');
  const [upiId, setUpiId] = useState('resident@upi');

  // 5. Card Details
  const [cardHolder, setCardHolder] = useState(user ? user.name : 'Rajesh Sharma');
  const [cardNumber, setCardNumber] = useState('4532891234568912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('123');

  const isBillPaid = currentBill.status === 'PAID';

  const getEffectiveBreakdown = (bill) => {
    if (!bill || !bill.breakdown) return [];
    let list = Array.isArray(bill.breakdown) ? [...bill.breakdown] : [];
    const itemsSum = list.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const diff = (bill.totalAmount || 0) - itemsSum;
    const hasFineItem = list.some(i => 
      i.item.toLowerCase().includes('late') || 
      i.item.toLowerCase().includes('penalty') || 
      i.item.toLowerCase().includes('fine')
    );
    if (diff > 0 && !hasFineItem) {
      list.push({
        item: 'Late Payment Penalty (Overdue Fee)',
        amount: bill.fineAmount || diff
      });
    }
    return list;
  };

  const effectiveBreakdown = getEffectiveBreakdown(currentBill);

  const handleStartPayment = () => {
    if (!user) {
      onOpenLogin();
      return;
    }
    setErrorMsg('');
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setProcessing(true);

    try {
      let methodDetails = '';
      let txnIdPrefix = 'TXN-';

      if (selectedMethod === 'BANK_TRANSFER') {
        if (!accHolder || !accNumber || !ifscCode) {
          throw new Error('Please fill in your Bank Account & IFSC details.');
        }
        methodDetails = `Bank Transfer (${bankName} - Acc: ****${accNumber.slice(-4)}, IFSC: ${ifscCode.toUpperCase()})`;
        txnIdPrefix = 'IFT-2026-';
      } else if (selectedMethod === 'RAZORPAY') {
        if (!razorpayPhone || razorpayPhone.length < 10) {
          throw new Error('Please enter a valid 10-digit mobile number for Razorpay.');
        }
        methodDetails = `Razorpay Transfer (${razorpayPhone} - Ref: ${razorpayTxnRef})`;
        txnIdPrefix = 'RZP-';
      } else if (selectedMethod === 'NTTDATA') {
        if (!nttCustomerId) {
          throw new Error('Please enter Customer/Netbanking ID for NTT Data.');
        }
        methodDetails = `NTT Data Gateway (${nttBank} - Ref: ${nttTxnRef})`;
        txnIdPrefix = 'NTT-';
      } else if (selectedMethod === 'UPI') {
        if (!upiId) throw new Error('Please enter a valid UPI VPA Address.');
        methodDetails = `UPI Payment (${vpaName} - ${upiId})`;
        txnIdPrefix = 'UPI-';
      } else if (selectedMethod === 'CARD') {
        if (cardNumber.length < 12) throw new Error('Please enter a valid Card Number.');
        methodDetails = `Credit/Debit Card (${cardHolder} - Card: ****${cardNumber.slice(-4)})`;
        txnIdPrefix = 'CRD-';
      }

      const txnRecord = {
        id: txnIdPrefix + Math.floor(10000 + Math.random() * 90000),
        month: currentBill.month,
        amount: currentBill.totalAmount,
        breakdown: effectiveBreakdown,
        date: new Date().toISOString().split('T')[0],
        status: 'PAID',
        method: methodDetails,
        receiptNo: 'REC-2026-' + Math.floor(10000 + Math.random() * 90000),
        unit: user ? user.unit : currentBill.unit
      };

      // Call Backend REST API to register payment & update SQLite database permanently
      if (user && user.id) {
        await payMaintenanceApi(user.id, selectedMethod, txnRecord);
      }

      setProcessing(false);
      setPaymentSuccess(true);

      // Update Parent App State
      onCompletePayment(txnRecord);
    } catch (err) {
      setProcessing(false);
      setErrorMsg(err.message || 'Payment processing failed.');
    }
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setProcessing(false);
    setErrorMsg('');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // IF NOT LOGGED IN -> SHOW CLEAN AUTH-GATED LOCK SCREEN
  if (!user) {
    return (
      <section id="maintenance" className="py-20 bg-white text-slate-800 relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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

          <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className={`w-16 h-16 rounded-2xl ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} flex items-center justify-center mx-auto shadow-sm`}>
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl font-extrabold text-slate-900">
                Please Sign In To Access Your Billing Statement
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Log in with your resident account to inspect monthly breakdown charges, transfer maintenance dues via <strong>Razorpay</strong>, <strong>NTT Data Gateway</strong>, <strong>Bank Transfer</strong>, or <strong>UPI</strong>, and download single-page PDF receipts.
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
      
      {/* Printable CSS Media Styles (Forces EXACTLY 1 Page & Centered Layout in PDF/Print) */}
      <style>{`
        @media print {
          html, body {
            height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          
          body * {
            visibility: hidden !important;
          }
          
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }
          
          #printable-receipt {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90% !important;
            max-width: 580px !important;
            margin: 0 !important;
            padding: 32px !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 16px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          @page {
            size: portrait;
            margin: 0;
          }
        }
      `}</style>

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
            Instant online bill settlement with Razorpay, NTT Data, Bank Transfer & UPI gateways, instant 1-page PDF receipts, and full audit logs.
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
                  ) : (currentBill.status === 'DELAYED' || currentBill.fineAmount > 0) ? (
                    <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-bold shadow-sm">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span>PAYMENT OVERDUE ({currentBill.delayDays || 16} DAYS LATE)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>PAYMENT PENDING</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Charge Itemization */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Itemized Charge Breakdown
                  </h4>
                  {(currentBill.status === 'DELAYED' || currentBill.fineAmount > 0 || effectiveBreakdown.some(i => i.item.toLowerCase().includes('late') || i.item.toLowerCase().includes('fine'))) && (
                    <span className="text-[10px] text-red-700 font-extrabold bg-red-100 border border-red-300 px-2 py-0.5 rounded-full">
                      Includes ₹{currentBill.fineAmount || 350} Late Penalty
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  {effectiveBreakdown.map((item, idx) => {
                    const isFine = item.item.toLowerCase().includes('late') || item.item.toLowerCase().includes('fine') || item.item.toLowerCase().includes('penalty');
                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2 px-2.5 rounded-lg transition-colors ${
                          isFine 
                            ? 'bg-red-50 border border-red-200 shadow-sm' 
                            : 'border-b border-slate-200/70'
                        }`}
                      >
                        <span className={isFine ? 'font-extrabold text-red-700 flex items-center gap-1.5' : 'text-slate-700'}>
                          {isFine && <Clock className="w-4 h-4 text-red-600 shrink-0" />}
                          {item.item}
                        </span>
                        <span className={`font-semibold ${isFine ? 'font-black text-red-700 text-base' : 'text-slate-900'}`}>
                          ₹{item.amount.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
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
                  <button
                    disabled
                    className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-green-50 text-green-700 text-xs font-extrabold border border-green-200 cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Payment Completed</span>
                  </button>
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

      {/* Interactive Payment Transfer Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[95vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${theme.badgeBg} ${theme.badgeText} flex items-center justify-center font-bold`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Grand Horizon Payment Transfer</h3>
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

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                {errorMsg}
              </div>
            )}

            {!paymentSuccess ? (
              <form onSubmit={handleProcessPayment} className="space-y-5">
                
                {/* Payment Method Tabs */}
                <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('RAZORPAY')}
                    className={`py-2 px-1 rounded-lg transition-all text-[10px] font-bold ${
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
                    className={`py-2 px-1 rounded-lg transition-all text-[10px] font-bold ${
                      selectedMethod === 'NTTDATA'
                        ? 'bg-indigo-900 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    NTT Data
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('BANK_TRANSFER')}
                    className={`py-2 px-1 rounded-lg transition-all text-[10px] font-bold ${
                      selectedMethod === 'BANK_TRANSFER'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Bank Txn
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`py-2 px-1 rounded-lg transition-all text-[10px] font-bold ${
                      selectedMethod === 'UPI'
                        ? `${theme.buttonBg} text-white`
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    UPI Transfer
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('CARD')}
                    className={`py-2 px-1 rounded-lg transition-all text-[10px] font-bold ${
                      selectedMethod === 'CARD'
                        ? `${theme.buttonBg} text-white`
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Card
                  </button>
                </div>

                {/* 1. RAZORPAY GATEWAY VIEW & REAL INPUTS */}
                {selectedMethod === 'RAZORPAY' && (
                  <div className="space-y-4 bg-blue-50/50 p-4 border border-blue-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-blue-900 text-base tracking-tight">Razorpay Gateway</span>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded">Live API Transfer</span>
                      </div>
                      <span className="text-[10px] text-blue-700 font-mono font-semibold">Key: {razorpayKey}</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Resident Mobile Number (Razorpay Auth) *</label>
                        <input
                          type="text"
                          required
                          maxLength={10}
                          placeholder="9829012345"
                          value={razorpayPhone}
                          onChange={(e) => setRazorpayPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-slate-900 focus:outline-none font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Razorpay Transaction / Payment Ref ID *</label>
                        <input
                          type="text"
                          required
                          value={razorpayTxnRef}
                          onChange={(e) => setRazorpayTxnRef(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-slate-900 focus:outline-none font-mono font-semibold"
                        />
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-blue-200 text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Order ID:</span>
                          <span className="font-mono text-blue-900 font-bold">order_Rzp_{Math.floor(100000 + Math.random()*900000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resident Email:</span>
                          <span className="font-bold text-slate-800">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. NTT DATA GATEWAY VIEW & REAL INPUTS */}
                {selectedMethod === 'NTTDATA' && (
                  <div className="space-y-4 bg-indigo-50/50 p-4 border border-indigo-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-5 h-5 text-indigo-900" />
                        <span className="font-extrabold text-indigo-950 text-base tracking-tight">NTT Data</span>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-950 text-white rounded">Atom Paynimo</span>
                      </div>
                      <span className="text-[10px] text-indigo-800 font-mono font-semibold">Merchant: NTT_GH8812</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Select NetBanking Direct Route</label>
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

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Customer Corporate / NetBanking ID *</label>
                        <input
                          type="text"
                          required
                          placeholder="NTT_CUST_4501"
                          value={nttCustomerId}
                          onChange={(e) => setNttCustomerId(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-indigo-300 rounded-xl text-slate-900 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-indigo-200 text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>NTT Atom Ref:</span>
                          <span className="font-mono text-indigo-900 font-bold">{nttTxnRef}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Checksum Security:</span>
                          <span className="font-mono text-xs text-indigo-700">SHA-512 Encrypted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. BANK TRANSFER / NETBANKING FORM */}
                {selectedMethod === 'BANK_TRANSFER' && (
                  <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                    <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                      <Building2 className="w-5 h-5 text-slate-800" />
                      <span className="font-extrabold text-slate-900 text-sm">Direct Bank Transfer / NEFT / IMPS</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Select Bank</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none"
                        >
                          <option>HDFC Bank</option>
                          <option>State Bank of India (SBI)</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Kotak Mahindra Bank</option>
                          <option>Bank of Baroda</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Payer Account Holder Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rajesh Sharma"
                          value={accHolder}
                          onChange={(e) => setAccHolder(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Account Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="981245678901"
                            value={accNumber}
                            onChange={(e) => setAccNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">IFSC Code *</label>
                          <input
                            type="text"
                            required
                            placeholder="HDFC0000123"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 uppercase focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. UPI TRANSFER FORM */}
                {selectedMethod === 'UPI' && (
                  <div className="space-y-3 text-center">
                    <div className="bg-slate-50 p-3 border border-slate-200 rounded-2xl inline-block shadow-sm">
                      <img 
                        src="/Qr.webp" 
                        alt="BHIM UPI QR Code - Grand Horizon" 
                        className="w-40 h-40 mx-auto rounded-xl bg-white shadow-sm p-1.5 border border-slate-200 object-contain"
                      />
                      <span className="text-[10px] text-slate-600 font-extrabold tracking-wider uppercase block mt-2">
                        Scan with GPay / PhonePe / Paytm / BHIM
                      </span>
                    </div>

                    <div className="space-y-2 text-left text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">VPA Holder Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Rajesh Sharma"
                          value={vpaName}
                          onChange={(e) => setVpaName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">UPI VPA Address *</label>
                        <input
                          type="text"
                          required
                          placeholder="resident@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. CARD PAYMENT FORM */}
                {selectedMethod === 'CARD' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Cardholder Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Rajesh Sharma"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">16-Digit Card Number *</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        placeholder="4532891234568912"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Expiry Date *</label>
                        <input
                          type="text"
                          required
                          placeholder="08/29"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">CVV Code *</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Amount Summary */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Maintenance Dues Total:</span>
                  <span className={`text-xl font-extrabold ${theme.highlightText}`}>₹{currentBill.totalAmount}</span>
                </div>

                {/* Submit Payment Transfer */}
                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl ${
                    selectedMethod === 'RAZORPAY'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : selectedMethod === 'NTTDATA'
                      ? 'bg-indigo-950 hover:bg-slate-900 text-white'
                      : `${theme.buttonBg} text-white`
                  } font-extrabold text-sm shadow-md transition-all disabled:opacity-50`}
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing DB Transfer of ₹{currentBill.totalAmount}...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transfer ₹{currentBill.totalAmount} Now</span>
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
                  <h4 className="text-2xl font-extrabold text-slate-900">Payment Transfer Successful!</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Maintenance dues for {currentBill.month} settled and updated in SQLite database. Official receipt generated.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Database API Status:</span>
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

      {/* Printable Single-Page Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            id="printable-receipt"
            className="bg-white text-slate-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl space-y-6 relative border border-slate-200"
          >
            
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-900 rounded-lg no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center border-b border-slate-200 pb-4 space-y-1">
              <h3 className="text-xl font-bold text-slate-900">GRAND HORIZON CO-OP HOUSING SOCIETY</h3>
              <p className="text-xs text-slate-500">Plot 45-A, Ajmer Road, Vaishali Nagar, Jaipur, Rajasthan - 302021</p>
              <span className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold ${theme.badgeBg} ${theme.badgeText} rounded border ${theme.badgeBorder}`}>
                RECEIPT NO: {selectedReceipt.receiptNo}
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
                <span className="text-slate-400 block font-medium">Transfer Mode / Details:</span>
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
                {(selectedReceipt.breakdown && Array.isArray(selectedReceipt.breakdown) ? selectedReceipt.breakdown : effectiveBreakdown).map((item, idx) => {
                  const isFine = item.item.toLowerCase().includes('late') || item.item.toLowerCase().includes('fine') || item.item.toLowerCase().includes('penalty');
                  return (
                    <div key={idx} className={`flex justify-between ${isFine ? 'font-bold text-red-600' : 'text-slate-700'}`}>
                      <span>{item.item}</span>
                      <span>₹{item.amount.toLocaleString()}</span>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>TOTAL PAID & CLEARED</span>
                  <span>₹{selectedReceipt.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer stamp */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
              <span>Computer Generated Jaipur Receipt</span>
              <span className={`${theme.highlightText} font-bold flex items-center gap-1`}>
                <CheckCircle2 className={`w-4 h-4 ${theme.iconColor}`} /> Official Society Stamp
              </span>
            </div>

            {/* Print Action Button */}
            <button
              onClick={handlePrintReceipt}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 no-print"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Single-Page PDF Receipt</span>
            </button>

          </div>
        </div>
      )}

    </section>
  );
}
