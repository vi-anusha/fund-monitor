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
const insertStmt = db.prepare("INSERT OR IGNORE INTO funds (code, name, category) VALUES (?, ?, ?)");
// Wrap inserts in a transaction for speed
const insertFundsBatch = db.transaction((funds) => {
    for (const fund of funds) {
        insertStmt.run(fund.code, fund.name, "");
        console.log(`✅ Fund inserted: ${fund.code} (${fund.name})`);
    }
});

const safeInsertFundsBatch = (funds) => {
    let attempts = 0;
    while (attempts < 3) { // try max 3 times
        try {
            insertFundsBatch(funds);
            return;
        } catch (err) {
            if (err.code === 'SQLITE_BUSY') {
                console.warn("⚠️ Database is locked, retrying...");
                attempts++;
                continue;
            }
            throw err; // rethrow other errors
        }
    }
    console.error("❌ Transaction failed after retries (database is locked).");
};

// get schemecodes
const getFundCodes = () =>{
  const selectStmt = db.prepare("SELECT DISTINCT code from funds");
  const fundCodes = selectStmt.all();
  return fundCodes.map(row => row.code);
}

// get fund Id based on fundScheme code
const getFundId = (fundCode) =>{
  const fltrStmt = db.prepare(`SELECT DISTINCT id from funds WHERE funds.code = ${fundCode}`)
  return fltrStmt.all().map(row => row.id);
}

export {safeInsertFundsBatch, getFundCodes, getFundId};