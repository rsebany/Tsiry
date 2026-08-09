require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const TEST_DB_NAME = process.env.TEST_DB_NAME || 'hospital_test_db';

async function initTestDb() {
  const admin = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [TEST_DB_NAME]);
  if (exists.rows.length === 0) {
    await admin.query(`CREATE DATABASE "${TEST_DB_NAME}"`);
  }
  await admin.end();

  const testClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: TEST_DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await testClient.connect();
  const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'init.sql'), 'utf8');
  await testClient.query(sql);

  await testClient.query(
    `UPDATE t_rendez_vous SET statut = 'PRESENT'
     WHERE date_heure::date = CURRENT_DATE AND id_patient = 1`
  );

  await testClient.end();
  console.log(`Base de test '${TEST_DB_NAME}' initialisée.`);
}

initTestDb().catch((err) => {
  console.error("Erreur lors de l'initialisation de la base de test :", err.message);
  process.exit(1);
});
