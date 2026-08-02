const { Pool } = require('pg');

// Aligne le fuseau de la session PostgreSQL sur celui de l'application :
// les colonnes TIMESTAMP (sans TZ) sont traitées comme heure locale dans tout le backend.
const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: `-c TimeZone=${localTimeZone}`,
});

module.exports = pool;
