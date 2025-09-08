-- Keep only the first occurrence of (fund_id, date, NAV, correction): Removing Duplicates

DELETE FROM nav_history
WHERE id NOT IN (
  SELECT MIN(id)
  FROM nav_history
  GROUP BY fund_id, date, nav, correction
);
VACUUM;
