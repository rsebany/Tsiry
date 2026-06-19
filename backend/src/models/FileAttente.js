const pool = require('../config/db');

async function findActiveFileForToday() {
  const { rows } = await pool.query(
    `SELECT id_file, date_file FROM t_file_attente
     WHERE date_file = CURRENT_DATE LIMIT 1`
  );
  return rows[0] || null;
}

async function createTodayFile() {
  const { rows } = await pool.query(
    `INSERT INTO t_file_attente (date_file) VALUES (CURRENT_DATE)
     RETURNING id_file, date_file`
  );
  return rows[0];
}

async function getOrCreateTodayFile() {
  let file = await findActiveFileForToday();
  if (!file) {
    file = await createTodayFile();
  }
  return file;
}

module.exports = { findActiveFileForToday, createTodayFile, getOrCreateTodayFile };
