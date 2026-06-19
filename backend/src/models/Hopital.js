const pool = require('../config/db');

async function findAll() {
  const { rows } = await pool.query(
    `SELECT id_hopital, nom, latitude, longitude, type FROM t_hopital ORDER BY nom ASC`
  );
  return rows;
}

module.exports = { findAll };
