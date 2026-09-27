const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'society.db');
const db = new Database(dbPath);

console.log('Resetting SQLite Database payments and maintenance bills for all users...');

// 1. Reset maintenance_bills table
db.exec(`
  UPDATE maintenance_bills
  SET status = 'PENDING', paid_at = NULL, method = NULL, receipt_no = NULL
  WHERE status = 'PAID';
`);

// Keep Amit Sharma as DELAYED (August 2026 overdue demo with fine)
const breakdownDelayed = JSON.stringify([
  { item: 'Flat Maintenance Charge', amount: 2400 },
  { item: 'Water & Sewerage Usage', amount: 450 },
  { item: 'Clubhouse & Amenities Fee', amount: 350 },
  { item: 'Sinking & Reserve Fund', amount: 300 },
  { item: 'Late Payment Penalty (Overdue Fee)', amount: 350 }
]);

db.exec(`
  UPDATE maintenance_bills
  SET month = 'August 2026', due_date = '2026-08-10', status = 'DELAYED', total_amount = 3850, delay_days = 48, fine_amount = 350, breakdown_json = '${breakdownDelayed}'
  WHERE unit = 'Block A - 102';
`);

// 2. Delete test September 2026 transactions
db.exec(`
  DELETE FROM payment_transactions
  WHERE month = 'September 2026';
`);

console.log('Successfully reset all user payment records in SQLite database!');
