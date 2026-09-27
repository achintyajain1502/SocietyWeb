import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import NoticeBoard from './components/NoticeBoard';
import MaintenancePayment from './components/MaintenancePayment';
import GallerySection from './components/GallerySection';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';

import { THEMES } from './services/themes';
import { fetchUserBillApi } from './services/api';
import {
  getStoredNotices,
  saveNotices,
  getStoredGallery,
  saveGallery,
  getStoredPayments,
  savePayments,
  getStoredUser,
  saveUser,
  getCurrentBill,
  saveCurrentBill,
  resetDemoPayments
} from './services/storage';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]); // Default Royal Indigo & Blue

  // App Data States
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [payments, setPayments] = useState([]);
  const [currentBill, setCurrentBill] = useState({
    month: 'September 2026',
    dueDate: '2026-09-10',
    unit: 'Block B - 402',
    status: 'PENDING',
    breakdown: [
      { item: 'Flat Maintenance Charge', amount: 2400 },
      { item: 'Water Usage & Sewerage', amount: 450 },
      { item: 'Clubhouse & Gym Access', amount: 350 },
      { item: 'Sinking & Reserve Fund', amount: 300 }
    ],
    totalAmount: 3500
  });

  // Load Initial Global Data
  useEffect(() => {
    setNotices(getStoredNotices());
    setGallery(getStoredGallery());
    const storedUser = getStoredUser();
    setUser(storedUser);

    // Theme persistence
    const savedThemeId = localStorage.getItem('gh_theme');
    if (savedThemeId) {
      const found = THEMES.find((t) => t.id === savedThemeId);
      if (found) setCurrentTheme(found);
    }
  }, []);

  // Fetch specific user's bill from SQLite API whenever `user` changes
  useEffect(() => {
    if (user && user.id) {
      fetchUserBillApi(user.id)
        .then((res) => {
          if (res && res.currentBill) {
            setCurrentBill(res.currentBill);
            setPayments(res.payments || []);
            saveCurrentBill(res.currentBill, user.id);
            savePayments(res.payments || [], user.id);
          }
        })
        .catch(() => {
          // Fallback to per-user localStorage
          setCurrentBill(getCurrentBill(user.id));
          setPayments(getStoredPayments(user.id));
        });
    } else {
      setCurrentBill(getCurrentBill(null));
      setPayments(getStoredPayments(null));
    }
  }, [user]);

  const handleSelectTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('gh_theme', theme.id);
  };

  // Handlers
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    saveUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    saveUser(null);
    setActiveSection('home');
  };

  const handleAddNotice = (newNotice) => {
    const updated = [newNotice, ...notices];
    setNotices(updated);
    saveNotices(updated);
  };

  const handleDeleteNotice = (noticeId) => {
    const updated = notices.filter((n) => n.id !== noticeId);
    setNotices(updated);
    saveNotices(updated);
  };

  const handleTogglePinNotice = (noticeId) => {
    const updated = notices.map((n) => (n.id === noticeId ? { ...n, pinned: !n.pinned } : n));
    setNotices(updated);
    saveNotices(updated);
  };

  const handleAddGalleryImage = (newImage) => {
    const updated = [newImage, ...gallery];
    setGallery(updated);
    saveGallery(updated);
  };

  const handleDeleteGalleryImage = (imageId) => {
    const updated = gallery.filter((g) => g.id !== imageId);
    setGallery(updated);
    saveGallery(updated);
  };

  const handleCompletePayment = (txnRecord) => {
    const updatedPayments = [txnRecord, ...payments];
    setPayments(updatedPayments);

    const updatedBill = {
      ...currentBill,
      status: 'PAID'
    };
    setCurrentBill(updatedBill);

    if (user && user.id) {
      savePayments(updatedPayments, user.id);
      saveCurrentBill(updatedBill, user.id);
    }
  };

  const handleResetPayment = () => {
    const userId = user ? user.id : null;
    const resetData = resetDemoPayments(userId);
    setPayments(resetData.payments);
    setCurrentBill(resetData.currentBill);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white flex flex-col transition-colors duration-300">
      
      {/* Top Fixed Header Navbar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Main Page Body */}
      <main className="flex-grow">
        {/* Top Hero Section */}
        <Hero
          onNavigate={(sec) => {
            setActiveSection(sec);
            const el = document.getElementById(sec);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          user={user}
          theme={currentTheme}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* Content Paragraphs / About Section */}
        <AboutSection theme={currentTheme} user={user} />

        {/* Interactive Notice Board */}
        <NoticeBoard
          notices={notices}
          onAddNotice={handleAddNotice}
          onDeleteNotice={handleDeleteNotice}
          onTogglePinNotice={handleTogglePinNotice}
          user={user}
          onOpenLogin={() => setIsLoginOpen(true)}
          theme={currentTheme}
        />

        {/* Maintenance Fee Payment Portal (ONLY VISIBLE AFTER LOGIN) */}
        {user && (
          <MaintenancePayment
            currentBill={currentBill}
            payments={payments}
            onCompletePayment={handleCompletePayment}
            user={user}
            onOpenLogin={() => setIsLoginOpen(true)}
            theme={currentTheme}
          />
        )}

        {/* Society Photo Gallery (ONLY VISIBLE AFTER LOGIN) */}
        {user && (
          <GallerySection
            gallery={gallery}
            onAddImage={handleAddGalleryImage}
            onDeleteImage={handleDeleteGalleryImage}
            user={user}
            onOpenLogin={() => setIsLoginOpen(true)}
            theme={currentTheme}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(sec) => {
          setActiveSection(sec);
          const el = document.getElementById(sec);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        theme={currentTheme}
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Authentication Login / Register Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        theme={currentTheme}
      />

    </div>
  );
}
