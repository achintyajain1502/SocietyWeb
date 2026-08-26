// Initial default data for Grand Horizon Housing Society

const DEFAULT_NOTICES = [
  {
    id: 'n1',
    title: 'Annual General Body Meeting (AGM) 2026 Announcement',
    category: 'Event',
    content: 'All residents and flat owners are cordially invited to attend the Annual General Body Meeting scheduled for Sunday, Sept 14th at 10:30 AM in the Main Clubhouse Auditorium. Key agenda includes budget review, solar panel installation approval, and committee elections.',
    author: 'Management Committee',
    date: '2026-08-24',
    pinned: true,
    important: true,
  },
  {
    id: 'n2',
    title: 'Scheduled Elevator Maintenance & Servicing (Blocks A & B)',
    category: 'Maintenance',
    content: 'Elevator servicing will take place on Thursday between 10:00 AM and 2:00 PM. Elevator #2 in Block A and Elevator #1 in Block B will be temporarily out of service. Please plan accordingly.',
    author: 'Facility Manager',
    date: '2026-08-22',
    pinned: false,
    important: false,
  },
  {
    id: 'n3',
    title: 'Urgent: Enhanced Visitor Verification Protocols at Main Gate',
    category: 'Urgent',
    content: 'To improve security, all guest vehicles must register via the Society Resident App or present digital passcode verification at Gate 1 & Gate 2 starting September 1st.',
    author: 'Security Cell',
    date: '2026-08-20',
    pinned: true,
    important: true,
  },
  {
    id: 'n4',
    title: 'Monsoon Plantation Drive & Kids Green Club',
    category: 'General',
    content: 'Join us this Saturday at 8:30 AM in the Central Park garden area for our annual tree plantation initiative. Saplings and gardening equipment will be provided for all families!',
    author: 'Environment Sub-committee',
    date: '2026-08-18',
    pinned: false,
    important: false,
  }
];

const DEFAULT_GALLERY = [
  {
    id: 'g1',
    title: 'Grand Horizon Towers Front Lawn & Entrance',
    category: 'Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    uploadedBy: 'Society Admin',
    date: '2026-08-15',
    likes: 24,
  },
  {
    id: 'g2',
    title: 'Infinity Swimming Pool & Sun Deck',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    uploadedBy: 'Sports Committee',
    date: '2026-08-10',
    likes: 42,
  },
  {
    id: 'g3',
    title: 'Community Clubhouse & Banquet Hall',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    uploadedBy: 'Events Team',
    date: '2026-08-05',
    likes: 31,
  },
  {
    id: 'g4',
    title: 'Annual Cultural Evening & Concert',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    uploadedBy: 'Resident Association',
    date: '2026-07-28',
    likes: 58,
  },
  {
    id: 'g5',
    title: 'Children Play Park & Walking Track',
    category: 'Gardens',
    imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80',
    uploadedBy: 'Green Committee',
    date: '2026-07-20',
    likes: 19,
  },
  {
    id: 'g6',
    title: 'State-of-the-art Fitness Center',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    uploadedBy: 'Gym Coordinator',
    date: '2026-07-12',
    likes: 36,
  }
];

const DEFAULT_PAYMENTS = [
  {
    id: 'TXN-2026-0792',
    month: 'August 2026',
    amount: 3500,
    breakdown: {
      flatMaintenance: 2400,
      waterCharges: 400,
      clubhouse: 350,
      sinkingFund: 350
    },
    date: '2026-08-03',
    status: 'PAID',
    method: 'UPI (GooglePay)',
    receiptNo: 'REC-2026-8802',
    unit: 'Block B - 402'
  },
  {
    id: 'TXN-2026-0611',
    month: 'July 2026',
    amount: 3500,
    breakdown: {
      flatMaintenance: 2400,
      waterCharges: 400,
      clubhouse: 350,
      sinkingFund: 350
    },
    date: '2026-07-02',
    status: 'PAID',
    method: 'Credit Card (Visa)',
    receiptNo: 'REC-2026-7649',
    unit: 'Block B - 402'
  }
];

const DEFAULT_CURRENT_BILL = {
  month: 'September 2026',
  dueDate: '2026-09-10',
  unit: 'Block B - 402',
  residentName: 'John Doe',
  status: 'PENDING',
  breakdown: [
    { item: 'Flat Maintenance Charge', amount: 2400 },
    { item: 'Water & Sewerage Usage', amount: 450 },
    { item: 'Clubhouse & Amenities Fee', amount: 350 },
    { item: 'Sinking & Reserve Fund', amount: 300 }
  ],
  totalAmount: 3500
};

// Helper storage API
export const getStoredNotices = () => {
  const data = localStorage.getItem('gh_notices');
  return data ? JSON.parse(data) : DEFAULT_NOTICES;
};

export const saveNotices = (notices) => {
  localStorage.setItem('gh_notices', JSON.stringify(notices));
};

export const getStoredGallery = () => {
  const data = localStorage.getItem('gh_gallery');
  return data ? JSON.parse(data) : DEFAULT_GALLERY;
};

export const saveGallery = (gallery) => {
  localStorage.setItem('gh_gallery', JSON.stringify(gallery));
};

export const getStoredPayments = () => {
  const data = localStorage.getItem('gh_payments');
  return data ? JSON.parse(data) : DEFAULT_PAYMENTS;
};

export const savePayments = (payments) => {
  localStorage.setItem('gh_payments', JSON.stringify(payments));
};

export const getStoredUser = () => {
  const data = localStorage.getItem('gh_user');
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user) => {
  if (user) {
    localStorage.setItem('gh_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('gh_user');
  }
};

export const getCurrentBill = () => {
  const billState = localStorage.getItem('gh_current_bill');
  return billState ? JSON.parse(billState) : DEFAULT_CURRENT_BILL;
};

export const saveCurrentBill = (bill) => {
  localStorage.setItem('gh_current_bill', JSON.stringify(bill));
};

export const resetDemoPayments = () => {
  localStorage.removeItem('gh_payments');
  localStorage.removeItem('gh_current_bill');
  return {
    payments: DEFAULT_PAYMENTS,
    currentBill: DEFAULT_CURRENT_BILL
  };
};
