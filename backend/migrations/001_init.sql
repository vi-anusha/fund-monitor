-- Create Tables

SELECT sqlite_version();

DROP TABLE IF EXISTS funds;
DROP TABLE IF EXISTS nav_history;
DROP TABLE IF EXISTS alerts;

-- create funds table

CREATE TABLE IF NOT EXISTS funds (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	code TEXT unique,
	name TEXT,
	category TEXT
);

-- create nav_history table

CREATE TABLE IF NOT EXISTS nav_history (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	fund_id INTEGER,
	date date,
	correction REAL,
	FOREIGN KEY (fund_id)
		REFERENCES funds (id)
		ON DELETE CASCADE
		ON UPDATE NO ACTION
);

-- create alerts table

CREATE TABLE IF NOT EXISTS alerts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	fund_id INTEGER,
	alert_name TEXT,
	alert_type TEXT,
	threshold REAL,
	message TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (fund_id)
		REFERENCES funds (id)
		ON DELETE CASCADE
		ON UPDATE NO ACTION
);

