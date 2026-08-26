import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldAlert, ArrowUp } from 'lucide-react';

export default function Footer({ onNavigate, theme, user, onOpenLogin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-100 text-slate-600 border-t border-slate-200 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${theme.gradientBtn} flex items-center justify-center text-white font-bold shadow-md`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Grand Horizon Jaipur
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Premier Co-operative Housing Society in Vaishali Nagar, Jaipur. Registered under Rajasthan Co-operative Societies Act & RERA Rajasthan (`RAJ/P/2018/892`).
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className={`hover:${theme.highlightText} transition-colors`}>
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className={`hover:${theme.highlightText} transition-colors`}>
                  About Society & Committee
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notices')} className={`hover:${theme.highlightText} transition-colors`}>
                  Notice Board & Alerts
                </button>
              </li>
              {user ? (
                <>
                  <li>
                    <button onClick={() => onNavigate('maintenance')} className={`hover:${theme.highlightText} transition-colors`}>
                      Pay Maintenance Dues
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('gallery')} className={`hover:${theme.highlightText} transition-colors`}>
                      Photo Gallery
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button onClick={onOpenLogin} className={`hover:${theme.highlightText} transition-colors font-bold text-slate-800`}>
                    Resident Portal Login
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Jaipur Society Office</h4>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start space-x-2.5">
                <MapPin className={`w-4 h-4 ${theme.iconColor} flex-shrink-0 mt-0.5`} />
                <span>Plot No. 45-A, Ajmer Road, Near 200 Feet Bypass, Vaishali Nagar, Jaipur, Rajasthan - 302021, India</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className={`w-4 h-4 ${theme.iconColor} flex-shrink-0`} />
                <span>Office: +91 (0141) 235-8890 | +91 98290 99880</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className={`w-4 h-4 ${theme.iconColor} flex-shrink-0`} />
                <span>office@grandhorizonjaipur.com</span>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Emergency Helpline (Jaipur)
            </h4>
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs shadow-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Main Gate 1 Security:</span>
                <span className="font-bold text-slate-900">+91 98290 11001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Elevator Helpdesk:</span>
                <span className="font-bold text-slate-900">+91 94140 22008</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">On-Call Electrician:</span>
                <span className="font-bold text-slate-900">+91 98292 33210</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Grand Horizon Co-op Housing Society, Jaipur, Rajasthan, India. All Rights Reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200 shadow-sm"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
