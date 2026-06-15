const { Pool } = require('pg');

//POUR TESTER :
console.log("Vérification mot de passe :", typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD);
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
