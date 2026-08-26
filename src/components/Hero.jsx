import React from 'react';
import { CreditCard, Bell, Image as ImageIcon, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero({ onNavigate, user, theme, onOpenLogin }) {
  const handleMaintenanceClick = () => {
    if (!user) {
      onOpenLogin();
    } else {
      onNavigate('maintenance');
    }
  };

  const handleGalleryClick = () => {
    if (!user) {
      onOpenLogin();
    } else {
      onNavigate('gallery');
    }
  };

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-50">
      {/* Background Hero Image with Soft Light Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85"
          alt="Grand Horizon Society Jaipur Architecture"
          className="w-full h-full object-cover object-center filter brightness-95 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-slate-900/10" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center md:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Badge */}
            <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md`}>
              <Sparkles className={`w-4 h-4 ${theme.iconColor}`} />
              <span>Vaishali Nagar, Jaipur • Premier Gated Community</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Harmonious Living at <br className="hidden sm:inline" />
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.gradientText}`}>
                Grand Horizon Jaipur
              </span>
            </h1>

            {/* Subtext Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Experience modern residential comfort at Ajmer Road, Vaishali Nagar, Jaipur. Featuring 24/7 multi-tier security, 4.8 acres of green landscaped parks, instant maintenance billing via Razorpay & NTT Data, and resident portal.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={handleMaintenanceClick}
                className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r ${theme.gradientBtn} text-white font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5`}
              >
                <CreditCard className="w-5 h-5" />
                <span>{user ? 'Pay Maintenance Dues' : 'Login to Pay Dues'}</span>
              </button>

              <button
                onClick={() => onNavigate('notices')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-sm sm:text-base shadow-sm transition-all"
              >
                <Bell className={`w-5 h-5 ${theme.iconColor}`} />
                <span>View Notice Board</span>
              </button>

              <button
                onClick={handleGalleryClick}
                className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200 text-slate-700 font-medium text-sm sm:text-base transition-all"
              >
                <ImageIcon className="w-5 h-5 text-slate-500" />
                <span>{user ? 'Community Gallery' : 'Login for Gallery'}</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`w-4 h-4 ${theme.iconColor}`} />
                <span>24/7 Security & RFID Gates</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`w-4 h-4 ${theme.iconColor}`} />
                <span>Solar-Powered Campus</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`w-4 h-4 ${theme.iconColor}`} />
                <span>RERA Rajasthan Registered</span>
              </div>
            </div>

          </div>

          {/* Right Floating Quick Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${theme.iconColor}`} />
                  Jaipur Society Facts
                </h3>
                <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 rounded-full">
                  RERA Rajasthan
                </span>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                  <div className="text-2xl font-extrabold text-slate-900">240+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Residential Units</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                  <div className={`text-2xl font-extrabold ${theme.highlightText}`}>4.8 Acres</div>
                  <div className="text-xs text-slate-500 mt-0.5">Green Campus</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                  <div className={`text-2xl font-extrabold ${theme.highlightText}`}>100%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Power Backup</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                  <div className="text-2xl font-extrabold text-amber-700">4 Blocks</div>
                  <div className="text-xs text-slate-500 mt-0.5">A, B, C & D Towers</div>
                </div>
              </div>

              {/* Quick Status / Resident Banner */}
              <div className={`bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder} rounded-xl p-4 flex items-center justify-between text-xs text-slate-800`}>
                <div>
                  <div className={`font-bold ${theme.badgeText}`}>September Maintenance Cycle</div>
                  <div className="text-slate-500 mt-0.5">Due Date: 10th September 2026</div>
                </div>
                <button
                  onClick={handleMaintenanceClick}
                  className={`px-3.5 py-1.5 ${theme.buttonBg} text-white font-bold rounded-lg transition-colors shadow-sm`}
                >
                  {user ? 'Pay Now' : 'Login'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
