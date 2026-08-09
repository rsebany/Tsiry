require('./env');
const pool = require('../../src/config/db');

async function query(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}

async function close() {
  await pool.end();
}

module.exports = { query, close };
