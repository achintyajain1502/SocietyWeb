import React from 'react';
import { 
  Building, ShieldCheck, Dumbbell, Waves, Trees, Car, Zap, 
  Phone, Mail, CheckCircle, HeartHandshake, Leaf
} from 'lucide-react';

export default function AboutSection({ theme }) {
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

  const committeeMembers = [
    {
      name: 'Rajesh Sharma',
      role: 'Society President',
      block: 'Block A - 501',
      phone: '+91 98290 12345',
      email: 'president@grandhorizonjaipur.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Sunita Agarwal',
      role: 'General Secretary',
      block: 'Block B - 304',
      phone: '+91 98291 23456',
      email: 'secretary@grandhorizonjaipur.com',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Vikram Singh Rathore',
      role: 'Treasurer',
      block: 'Block C - 202',
      phone: '+91 94140 34567',
      email: 'treasurer@grandhorizonjaipur.com',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Ananya Gupta',
      role: 'Facilities & Security Head',
      block: 'Block D - 102',
      phone: '+91 94141 45678',
      email: 'facility@grandhorizonjaipur.com',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
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

        {/* Executive Management Committee */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Jaipur Executive Management Committee
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Elected resident representatives serving our Jaipur community with dedication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committeeMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover object-top filter hover:brightness-105 transition-all duration-500"
                />
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
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
