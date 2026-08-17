require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function initDb() {
  const sqlPath = path.join(__dirname, '..', 'sql', 'schema.sql');
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
