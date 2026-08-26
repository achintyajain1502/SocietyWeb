const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'society.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize Database Schemas
function initDb() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      unit TEXT NOT NULL,
      role TEXT DEFAULT 'Resident',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Maintenance Bills Table (Tracks Paid/Given vs Pending vs Delayed)
  db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      unit TEXT NOT NULL,
      month TEXT NOT NULL,
      due_date TEXT NOT NULL,
      total_amount INTEGER NOT NULL,
      breakdown_json TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('PAID', 'PENDING', 'DELAYED')),
      paid_at TEXT,
      method TEXT,
      receipt_no TEXT,
      delay_days INTEGER DEFAULT 0,
      fine_amount INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // 3. Payment Transactions Log Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      unit TEXT NOT NULL,
      month TEXT NOT NULL,
      amount INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      method TEXT NOT NULL,
      receipt_no TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // 4. Community Notices Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notices (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT NOT NULL,
      pinned INTEGER DEFAULT 0,
      important INTEGER DEFAULT 0
    );
  `);

  // 5. Society Life Gallery Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      uploaded_by TEXT NOT NULL,
      date TEXT NOT NULL,
      likes INTEGER DEFAULT 0
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

  if (userCount === 0) {
    console.log('Seeding initial SQLite database with users and maintenance records...');

    const defaultPasswordHash = bcrypt.hashSync('password123', 10);

    // Insert Default Users
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, phone, unit, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const user1 = insertUser.run('John Doe', 'john@horizon.com', defaultPasswordHash, '+91 98290 12345', 'Block B - 402', 'Resident');
    const user2 = insertUser.run('Amit Sharma', 'amit@horizon.com', defaultPasswordHash, '+91 98291 99881', 'Block A - 102', 'Resident');
    const user3 = insertUser.run('Rahul Kapoor', 'rahul@horizon.com', defaultPasswordHash, '+91 94140 88772', 'Block C - 301', 'Resident');
    const user4 = insertUser.run('Sarah Jenkins (Admin)', 'admin@horizon.com', defaultPasswordHash, '+91 94141 55443', 'Block A - 501', 'Admin');
    const user5 = insertUser.run('Pooja Mehta', 'pooja@horizon.com', defaultPasswordHash, '+91 98292 33445', 'Block D - 204', 'Resident');

    const breakdownStandard = JSON.stringify([
      { item: 'Flat Maintenance Charge', amount: 2400 },
      { item: 'Water & Sewerage Usage', amount: 450 },
      { item: 'Clubhouse & Amenities Fee', amount: 350 },
      { item: 'Sinking & Reserve Fund', amount: 300 }
    ]);

    const insertBill = db.prepare(`
      INSERT INTO maintenance_bills (user_id, unit, month, due_date, total_amount, breakdown_json, status, paid_at, method, receipt_no, delay_days, fine_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 1. John Doe -> PENDING
    insertBill.run(user1.lastInsertRowid, 'Block B - 402', 'September 2026', '2026-09-10', 3500, breakdownStandard, 'PENDING', null, null, null, 0, 0);

    // 2. Amit Sharma -> DELAYED (Overdue by 16 Days, Late Fee ₹350)
    insertBill.run(user2.lastInsertRowid, 'Block A - 102', 'September 2026', '2026-08-10', 3850, breakdownStandard, 'DELAYED', null, null, null, 16, 350);

    // 3. Rahul Kapoor -> PAID (GIVEN on Aug 5)
    insertBill.run(user3.lastInsertRowid, 'Block C - 301', 'September 2026', '2026-09-10', 3500, breakdownStandard, 'PAID', '2026-08-05', 'Razorpay API (pay_Rzp_881923)', 'REC-2026-99120', 0, 0);

    // 4. Pooja Mehta -> PAID (GIVEN on Aug 3)
    insertBill.run(user5.lastInsertRowid, 'Block D - 204', 'September 2026', '2026-09-10', 3500, breakdownStandard, 'PAID', '2026-08-03', 'NTT Data Gateway (HDFC NetBanking)', 'REC-2026-88129', 0, 0);

    // Insert Default Transactions
    const insertTxn = db.prepare(`
      INSERT INTO payment_transactions (id, user_id, unit, month, amount, date, status, method, receipt_no)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTxn.run('TXN-2026-0792', user1.lastInsertRowid, 'Block B - 402', 'August 2026', 3500, '2026-08-03', 'PAID', 'UPI (GooglePay)', 'REC-2026-8802');
    insertTxn.run('TXN-2026-0611', user1.lastInsertRowid, 'Block B - 402', 'July 2026', 3500, '2026-07-02', 'PAID', 'Credit Card (Visa)', 'REC-2026-7649');

    // Seed Notices
    const insertNotice = db.prepare(`
      INSERT INTO notices (id, title, category, content, author, date, pinned, important)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertNotice.run('n1', 'Annual General Body Meeting (AGM) 2026 Announcement', 'Event', 'All residents and flat owners are cordially invited to attend the Annual General Body Meeting scheduled for Sunday, Sept 14th at 10:30 AM in the Main Clubhouse Auditorium.', 'Management Committee', '2026-08-24', 1, 1);
    insertNotice.run('n2', 'Scheduled Elevator Maintenance & Servicing (Blocks A & B)', 'Maintenance', 'Elevator servicing will take place on Thursday between 10:00 AM and 2:00 PM. Elevator #2 in Block A will be temporarily out of service.', 'Facility Manager', '2026-08-22', 0, 0);
    insertNotice.run('n3', 'Urgent: Enhanced Visitor Verification Protocols at Main Gate', 'Urgent', 'To improve security, all guest vehicles must register via digital passcode verification at Gate 1 & Gate 2 starting September 1st.', 'Security Cell', '2026-08-20', 1, 1);

    // Seed Gallery
    const insertGallery = db.prepare(`
      INSERT INTO gallery (id, title, category, image_url, uploaded_by, date, likes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertGallery.run('g1', 'Grand Horizon Towers Front Lawn & Entrance', 'Infrastructure', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 'Society Admin', '2026-08-15', 24);
    insertGallery.run('g2', 'Infinity Swimming Pool & Sun Deck', 'Facilities', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80', 'Sports Committee', '2026-08-10', 42);
    insertGallery.run('g3', 'Community Clubhouse & Banquet Hall', 'Facilities', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'Events Team', '2026-08-05', 31);
  }
}

initDb();

module.exports = db;
