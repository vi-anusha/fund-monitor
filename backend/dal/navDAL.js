import Database from "better-sqlite3"

// Connect to DB
const db = new Database('./data/fund-monitor.db');

// Simple DB connection check
try {
  const stmt = db.prepare("SELECT * from funds");
  const row = stmt.get()
  console.log("✅ Connected to SQLite database");
} catch (err) {
  console.error("❌ Failed to connect to database:", err.message);
}

// Prepare the insert statement
const insertStmt = db.prepare("INSERT OR IGNORE INTO nav_history (fund_id, date, nav, correction) VALUES (?, ?, ?, ?)");
// Wrap inserts in a transaction for speed
const insertNavsBatch = db.transaction((navHistory) => {
    for (const nav of navHistory) {
        const dateValue = nav.date instanceof Date ? nav.date.toISOString() : nav.date;
        insertStmt.run(nav.fund_id, dateValue, nav.nav, nav.correction);
    }
    console.log(`✅ Fund NAV inserted`);
});

export {insertNavsBatch};