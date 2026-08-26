import React, { useState } from 'react';
import { Building2, Bell, CreditCard, Image as ImageIcon, Info, LogIn, LogOut, Shield, Menu, X, Palette, Check } from 'lucide-react';
import { THEMES } from '../services/themes';

export default function Navbar({ activeSection, setActiveSection, user, onOpenLogin, onLogout, currentTheme, onSelectTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // All potential nav links
  const allNavLinks = [
    { id: 'home', label: 'Home', icon: Building2, requiresAuth: false },
    { id: 'about', label: 'About Society', icon: Info, requiresAuth: false },
    { id: 'notices', label: 'Notice Board', icon: Bell, badge: 'New', requiresAuth: false },
    { id: 'maintenance', label: 'Pay Maintenance', icon: CreditCard, highlight: true, requiresAuth: true },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, requiresAuth: true },
  ];

  // Filter links so Maintenance and Gallery are NOT visible at all unless logged in
  const navLinks = allNavLinks.filter(link => !link.requiresAuth || user);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${currentTheme.gradientBtn} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 transition-colors">
                Grand Horizon
              </span>
              <span className={`block text-xs font-bold ${currentTheme.iconColor} tracking-wider uppercase`}>
                Co-op Housing Society
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Maintenance & Gallery hidden when !user) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? `${currentTheme.badgeBg} ${currentTheme.badgeText} border ${currentTheme.badgeBorder} font-bold`
                      : link.highlight
                      ? `${currentTheme.buttonBg} text-white font-bold shadow-md`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? currentTheme.iconColor : ''}`} />
                  <span>{link.label}</span>

                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] uppercase font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Auth Profile & Theme Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Theme Selector Button */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
                title="Change Color Theme"
              >
                <Palette className={`w-4 h-4 ${currentTheme.iconColor}`} />
                <span>Themes</span>
                <span className="w-2.5 h-2.5 rounded-full inline-block ml-1" style={{ backgroundColor: currentTheme.dot }} />
              </button>

              {/* Theme Dropdown Menu */}
              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in space-y-1">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Select Palette Theme
                  </div>
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        onSelectTheme(theme);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                        currentTheme.id === theme.id
                          ? 'bg-slate-100 text-slate-900 font-bold border border-slate-300'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="flex -space-x-1">
                          <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: theme.dot }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: theme.accentDot }} />
                        </div>
                        <span>{theme.name}</span>
                      </div>
                      {currentTheme.id === theme.id && (
                        <Check className="w-4 h-4 text-slate-900" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-3 bg-slate-100 border border-slate-200 rounded-xl py-1.5 px-3">
                <div className={`w-8 h-8 rounded-full ${currentTheme.buttonBg} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    {user.name}
                    {user.role === 'Admin' && (
                      <Shield className="w-3 h-3 text-amber-600 inline" title="Admin Role" />
                    )}
                  </div>
                  <div className="text-slate-500">{user.unit || 'Resident'}</div>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                <LogIn className={`w-4 h-4 ${currentTheme.iconColor}`} />
                <span>Resident Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Themes"
            >
              <Palette className={`w-5 h-5 ${currentTheme.iconColor}`} />
            </button>
            {!user && (
              <button
                onClick={onOpenLogin}
                className={`${currentTheme.buttonBg} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm`}
              >
                Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium ${
                  isActive
                    ? `${currentTheme.badgeBg} ${currentTheme.badgeText} font-bold border ${currentTheme.badgeBorder}`
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${currentTheme.iconColor}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Switch Color Theme</span>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => { onSelectTheme(theme); setMobileMenuOpen(false); }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                    currentTheme.id === theme.id ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.dot }} />
                  <span className="truncate">{theme.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {user && (
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 p-3 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-full ${currentTheme.buttonBg} text-white flex items-center justify-center font-bold text-sm`}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.unit} • {user.role}</div>
                </div>
              </div>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
