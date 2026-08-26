const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Grand Horizon SQLite Database API Server Running' });
});

// =========================================================================
// 1. AUTHENTICATION & REGISTRATION ENDPOINTS
// =========================================================================

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, unit, role } = req.body;

    if (!name || !email || !password || !unit) {
      return res.status(400).json({ error: 'Name, email, password, and unit are required fields.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userRole = role === 'Admin' ? 'Admin' : 'Resident';

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, phone, unit, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertUser.run(
      name.trim(),
      email.toLowerCase().trim(),
      passwordHash,
      phone || '+91 98290 00000',
      unit.trim(),
      userRole
    );

    const newUserId = result.lastInsertRowid;

    // Create Initial Maintenance Bill for the New Resident
    const breakdownStandard = JSON.stringify([
      { item: 'Flat Maintenance Charge', amount: 2400 },
      { item: 'Water & Sewerage Usage', amount: 450 },
      { item: 'Clubhouse & Amenities Fee', amount: 350 },
      { item: 'Sinking & Reserve Fund', amount: 300 }
    ]);

    db.prepare(`
      INSERT INTO maintenance_bills (user_id, unit, month, due_date, total_amount, breakdown_json, status, delay_days, fine_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newUserId, unit.trim(), 'September 2026', '2026-09-10', 3500, breakdownStandard, 'PENDING', 0, 0);

    const userProfile = {
      id: newUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '+91 98290 00000',
      unit: unit.trim(),
      role: userRole
    };

    res.status(201).json({
      message: 'Registration successful! Resident account created in SQLite database.',
      user: userProfile
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error creating user in SQLite database.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      unit: user.unit,
      role: user.role
    };

    res.json({
      message: 'Login successful!',
      user: userProfile
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server authentication error.' });
  }
});

// =========================================================================
// 2. MAINTENANCE BILLING & USER SPECIFIC DUES API
// =========================================================================

// GET /api/maintenance/my-bill?userId=X
app.get('/api/maintenance/my-bill', (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    let bill = db.prepare('SELECT * FROM maintenance_bills WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(userId);

    if (!bill) {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      const unitStr = user ? user.unit : 'Block B - 402';
      const breakdownStandard = JSON.stringify([
        { item: 'Flat Maintenance Charge', amount: 2400 },
        { item: 'Water & Sewerage Usage', amount: 450 },
        { item: 'Clubhouse & Amenities Fee', amount: 350 },
        { item: 'Sinking & Reserve Fund', amount: 300 }
      ]);

      db.prepare(`
        INSERT INTO maintenance_bills (user_id, unit, month, due_date, total_amount, breakdown_json, status, delay_days, fine_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, unitStr, 'September 2026', '2026-09-10', 3500, breakdownStandard, 'PENDING', 0, 0);

      bill = db.prepare('SELECT * FROM maintenance_bills WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(userId);
    }

    const payments = db.prepare('SELECT * FROM payment_transactions WHERE user_id = ? ORDER BY date DESC').all(userId);

    res.json({
      currentBill: {
        id: bill.id,
        month: bill.month,
        dueDate: bill.due_date,
        unit: bill.unit,
        status: bill.status, // 'PAID' (Given) | 'PENDING' | 'DELAYED' (Overdue)
        breakdown: JSON.parse(bill.breakdown_json),
        totalAmount: bill.total_amount,
        paidAt: bill.paid_at,
        method: bill.method,
        receiptNo: bill.receipt_no,
        delayDays: bill.delay_days || 0,
        fineAmount: bill.fine_amount || 0
      },
      payments
    });
  } catch (err) {
    console.error('Fetch Bill Error:', err);
    res.status(500).json({ error: 'Failed to fetch user maintenance bill' });
  }
});

// POST /api/maintenance/pay
app.post('/api/maintenance/pay', (req, res) => {
  try {
    const { userId, method, txnRecord } = req.body;

    if (!userId || !txnRecord) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Update maintenance bill status to PAID
    db.prepare(`
      UPDATE maintenance_bills
      SET status = 'PAID', paid_at = ?, method = ?, receipt_no = ?
      WHERE user_id = ? AND month = ?
    `).run(
      txnRecord.date,
      txnRecord.method,
      txnRecord.receiptNo,
      userId,
      txnRecord.month
    );

    // Insert Transaction
    db.prepare(`
      INSERT INTO payment_transactions (id, user_id, unit, month, amount, date, status, method, receipt_no)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      txnRecord.id,
      userId,
      txnRecord.unit,
      txnRecord.month,
      txnRecord.amount,
      txnRecord.date,
      'PAID',
      txnRecord.method,
      txnRecord.receiptNo
    );

    res.json({
      message: 'Payment processed and recorded in SQLite database!',
      txnRecord
    });
  } catch (err) {
    console.error('Payment Processing Error:', err);
    res.status(500).json({ error: 'Failed to process payment in database' });
  }
});

// POST /api/maintenance/reset-demo
app.post('/api/maintenance/reset-demo', (req, res) => {
  try {
    const { userId } = req.body;

    db.prepare(`
      UPDATE maintenance_bills
      SET status = 'PENDING', paid_at = NULL, method = NULL, receipt_no = NULL
      WHERE user_id = ?
    `).run(userId);

    res.json({ message: 'Demo payment status reset back to PENDING.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset demo payment' });
  }
});

// GET /api/admin/units-maintenance (Returns all flats: GIVEN / PAID vs DELAYED vs PENDING)
app.get('/api/admin/units-maintenance', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        u.id as user_id,
        u.name as resident_name,
        u.unit,
        u.phone,
        mb.month,
        mb.due_date,
        mb.total_amount,
        mb.status,
        mb.paid_at,
        mb.method,
        mb.receipt_no,
        mb.delay_days,
        mb.fine_amount
      FROM users u
      LEFT JOIN maintenance_bills mb ON u.id = mb.user_id
      ORDER BY u.unit ASC
    `).all();

    res.json({ units: rows });
  } catch (err) {
    console.error('Admin Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch admin summary' });
  }
});

// =========================================================================
// 3. NOTICES & GALLERY ENDPOINTS
// =========================================================================

// GET /api/notices
app.get('/api/notices', (req, res) => {
  try {
    const notices = db.prepare('SELECT * FROM notices ORDER BY date DESC').all();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// POST /api/notices
app.post('/api/notices', (req, res) => {
  try {
    const { title, category, content, author, date, pinned, important } = req.body;
    const id = 'n_' + Date.now();

    db.prepare(`
      INSERT INTO notices (id, title, category, content, author, date, pinned, important)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, category, content, author, date || new Date().toISOString().split('T')[0], pinned ? 1 : 0, important ? 1 : 0);

    const newNotice = db.prepare('SELECT * FROM notices WHERE id = ?').get(id);
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// GET /api/gallery
app.get('/api/gallery', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM gallery ORDER BY date DESC').all();
    const formatted = items.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      imageUrl: item.image_url,
      uploadedBy: item.uploaded_by,
      date: item.date,
      likes: item.likes
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// POST /api/gallery
app.post('/api/gallery', (req, res) => {
  try {
    const { title, category, imageUrl, uploadedBy, date } = req.body;
    const id = 'g_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    db.prepare(`
      INSERT INTO gallery (id, title, category, image_url, uploaded_by, date, likes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, category, imageUrl, uploadedBy || 'Resident', date || new Date().toISOString().split('T')[0], 1);

    res.status(201).json({ id, title, category, imageUrl, uploadedBy, date, likes: 1 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save photo' });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Grand Horizon Express + SQLite Database Server running at http://localhost:${PORT}`);
});
