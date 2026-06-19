const pool = require('../config/db');

async function findActiveFileForToday() {
  const { rows } = await pool.query(
    `SELECT id_file, date_du_jour FROM t_file_attente
     WHERE date_du_jour = CURRENT_DATE LIMIT 1`
  );
  return rows[0] || null;
}

async function createTodayFile() {
  const { rows } = await pool.query(
    `INSERT INTO t_file_attente (date_du_jour) VALUES (CURRENT_DATE)
     RETURNING id_file, date_du_jour`
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
