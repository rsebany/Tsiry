require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function initDb() {
  const sqlPath = path.join(__dirname, '..', 'sql', 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('Base de données initialisée avec succès.');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation :', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
