import React, { useState, useEffect } from 'react';
import { 
  Building, ShieldCheck, Dumbbell, Waves, Trees, Car, Zap, 
  Phone, Mail, CheckCircle, HeartHandshake, Leaf,
  Plus, Trash2, Edit3, X, Shield
} from 'lucide-react';

const DEFAULT_COMMITTEE = [
  {
    id: 'c1',
    name: 'Rajesh Sharma',
    role: 'Society President',
    block: 'Block A - 501',
    phone: '+91 98290 12345',
    email: 'president@grandhorizonjaipur.com',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'c2',
    name: 'Sunita Agarwal',
    role: 'General Secretary',
    block: 'Block B - 304',
    phone: '+91 98291 23456',
    email: 'secretary@grandhorizonjaipur.com',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'c3',
    name: 'Vikram Singh Rathore',
    role: 'Treasurer',
    block: 'Block C - 202',
    phone: '+91 94140 34567',
    email: 'treasurer@grandhorizonjaipur.com',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'c4',
    name: 'Ananya Gupta',
    role: 'Facilities & Security Head',
    block: 'Block D - 102',
    phone: '+91 94141 45678',
    email: 'facility@grandhorizonjaipur.com',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  }
];

export default function AboutSection({ theme, user }) {
  const [committeeMembers, setCommitteeMembers] = useState(() => {
    const saved = localStorage.getItem('gh_committee');
    return saved ? JSON.parse(saved) : DEFAULT_COMMITTEE;
  });

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // null for new, member object for edit

  // Form States
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberBlock, setMemberBlock] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberImage, setMemberImage] = useState('');

  const saveCommitteeData = (newList) => {
    setCommitteeMembers(newList);
    localStorage.setItem('gh_committee', JSON.stringify(newList));
  };

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setMemberName('');
    setMemberRole('Committee Member');
    setMemberBlock('Block A - 101');
    setMemberPhone('+91 98290 00000');
    setMemberEmail('member@grandhorizonjaipur.com');
    setMemberImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setShowMemberModal(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setMemberName(member.name);
    setMemberRole(member.role);
    setMemberBlock(member.block);
    setMemberPhone(member.phone);
    setMemberEmail(member.email);
    setMemberImage(member.image);
    setShowMemberModal(true);
  };

  const handleDeleteMember = (id) => {
    const updated = committeeMembers.filter((m) => m.id !== id);
    saveCommitteeData(updated);
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim()) return;

    if (editingMember) {
      // Edit existing member
      const updated = committeeMembers.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: memberName.trim(),
              role: memberRole.trim(),
              block: memberBlock.trim(),
              phone: memberPhone.trim(),
              email: memberEmail.trim(),
              image: memberImage.trim() || m.image
            }
          : m
      );
      saveCommitteeData(updated);
    } else {
      // Add new member
      const newMember = {
        id: 'c_' + Date.now(),
        name: memberName.trim(),
        role: memberRole.trim(),
        block: memberBlock.trim(),
        phone: memberPhone.trim(),
        email: memberEmail.trim(),
        image: memberImage.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      };
      saveCommitteeData([newMember, ...committeeMembers]);
    }

    setShowMemberModal(false);
  };

  const amenities = [
    {
      icon: Waves,
      title: 'Olympic-Size Pool',
      desc: 'Cleaned daily with dedicated kids pool area and trained lifeguard staff.'
    },
    {
      icon: Dumbbell,
      title: 'Modern Fitness Center',
      desc: 'Equipped with cardio machines, free weights, and dedicated yoga hall.'
    },
    {
      icon: ShieldCheck,
      title: '24/7 Multi-Tier Security',
      desc: 'CCTV surveillance, automated boom barriers, and biometric entry.'
    },
    {
      icon: Trees,
      title: 'Lush Central Gardens',
      desc: '4.8 acres of jogging tracks, flower gardens, and senior citizen benches.'
    },
    {
      icon: Car,
      title: 'Reserved Parking & EV Bay',
      desc: 'Covered podium parking with fast EV charging stations in every block.'
    },
    {
      icon: Zap,
      title: '100% DG Power Backup',
      desc: 'Uninterrupted power supply for elevators, water pumps, and essential flat lights.'
    },
    {
      icon: Leaf,
      title: 'Eco Rainwater Harvesting',
      desc: 'Zero-waste water recycling system and rooftop solar power panels.'
    },
    {
      icon: Building,
      title: 'Community Clubhouse',
      desc: 'Air-conditioned banquet facility for weddings, birthdays & society events.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white text-slate-800 relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs font-semibold uppercase tracking-wider`}>
            <HeartHandshake className={`w-4 h-4 ${theme.iconColor}`} />
            <span>About Our Jaipur Community</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            A Modern Oasis Designed For Comfort, Peace & Community in Jaipur
          </h2>
          <div className={`w-20 h-1 bg-gradient-to-r ${theme.gradientBtn} mx-auto rounded-full`} />
        </div>

        {/* Content Paragraphs Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-slate-600 leading-relaxed text-base">
            <p className="text-lg font-medium text-slate-800">
              Established in 2018, <strong className={`${theme.highlightText} font-bold`}>Grand Horizon Co-operative Housing Society</strong> located at Vaishali Nagar, Jaipur stands as a benchmark of modern residential living in Pink City. Spread across 4.8 lush acres, our community brings together 240+ families residing in four meticulously planned residential towers (Blocks A, B, C, and D).
            </p>

            <p>
              Registered under the Rajasthan Co-operative Societies Act and RERA Rajasthan (`RAJ/P/2018/892`), our society is managed by an elected Executive Management Committee committed to transparency, eco-friendly solar power, rainwater harvesting, and top-tier infrastructure maintenance.
            </p>

            <p>
              Beyond physical amenities, Grand Horizon Jaipur fosters a vibrant culture of neighborly warmth, celebrating festivals like Teej, Diwali, Makar Sankranti, and Holi together in our spacious central clubhouse and landscaped lawns.
            </p>

            {/* Core Values Bullets */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-slate-800">
              <div className="flex items-center space-x-2.5">
                <CheckCircle className={`w-5 h-5 ${theme.iconColor} flex-shrink-0`} />
                <span>RERA Rajasthan Registered</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle className={`w-5 h-5 ${theme.iconColor} flex-shrink-0`} />
                <span>Zero-Waste Green Campus</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle className={`w-5 h-5 ${theme.iconColor} flex-shrink-0`} />
                <span>24/7 Gated Security & RFID</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle className={`w-5 h-5 ${theme.iconColor} flex-shrink-0`} />
                <span>Prompt Maintenance Helpdesk</span>
              </div>
            </div>

          </div>

          {/* Right Image Feature Card */}
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                alt="Grand Horizon Jaipur Clubhouse"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="p-6 bg-white/95 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Central Community Clubhouse</h4>
                    <p className="text-xs text-slate-500">Vaishali Nagar, Ajmer Road, Jaipur</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} rounded-full`}>
                    Air Conditioned
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Amenities Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              World-Class Society Amenities
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Everything you need for an enriched health, leisure, and social lifestyle in Jaipur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl ${theme.badgeBg} ${theme.iconColor} border ${theme.badgeBorder} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Management Committee Section */}
        <div className="mt-24">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Jaipur Executive Management Committee
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Elected resident representatives serving our Jaipur community with dedication.
              </p>
            </div>

            {/* Admin Add Committee Member Button */}
            {user && user.role === 'Admin' && (
              <button
                onClick={handleOpenAddModal}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl ${theme.buttonBg} text-white font-extrabold text-sm shadow-md transition-all`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Committee Member (Admin)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committeeMembers.map((member) => (
              <div
                key={member.id || member.name}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-48 object-cover object-top filter hover:brightness-105 transition-all duration-500"
                    />

                    {/* Admin Actions Overlay on Committee Member */}
                    {user && user.role === 'Admin' && (
                      <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-xl backdrop-blur-md">
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                          title="Edit Committee Member"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                      <p className={`text-xs font-bold ${theme.highlightText}`}>{member.role}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{member.block}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {user && user.role === 'Admin' && (
                  <div className="px-5 pb-4">
                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                      <Shield className="w-3 h-3 text-indigo-600" /> Admin Editable Member
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal Dialog: Add / Edit Committee Member (Admin Only) */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${theme.badgeBg} ${theme.badgeText} flex items-center justify-center font-bold`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingMember ? 'Edit Committee Member' : 'Add Executive Committee Member'}
                  </h3>
                  <p className="text-xs text-slate-500">Manage leadership profile displayed on the homepage</p>
                </div>
              </div>
              <button
                onClick={() => setShowMemberModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Society President"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resident Flat / Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Block A - 501"
                    value={memberBlock}
                    onChange={(e) => setMemberBlock(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98290 12345"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="president@grandhorizon.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Member Photo URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={memberImage}
                  onChange={(e) => setMemberImage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl ${theme.buttonBg} text-white font-extrabold text-sm shadow-md transition-all mt-2`}
              >
                {editingMember ? 'Save Member Changes' : 'Add Member To Homepage'}
              </button>

            </form>

          </div>
        </div>
      )}

    </section>
  );
}
