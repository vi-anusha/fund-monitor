DELETE FROM nav_history
WHERE fund_id IN (
	SELECT fund_id from (
	SELECT max(date) as end_date, fund_id
	FROM nav_history
	GROUP BY fund_id) as n
	WHERE end_date < date('2024-12-31')
);
VACUUM;
