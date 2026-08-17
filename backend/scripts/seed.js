#!/usr/bin/env node

/**
 * Script de seed — insère des données de développement dans la base.
 *
 * Usage :
 *   cd backend && npm run seed
 *
 * Prérequis : la base doit exister avec le schéma chargé (npm run db:init).
 * Idempotent : recrée les données à chaque exécution (DELETE puis INSERT).
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'hospital_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

const DEMO_PASSWORD = 'demo123';
const ADMIN_PASSWORD = 'admin123';

async function hash(pw) {
  return bcrypt.hash(pw, 10);
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Nettoyage ──────────────────────────────────────────
    await client.query('DELETE FROM t_journal_activite');
    await client.query('DELETE FROM t_cas_urgence');
    await client.query('DELETE FROM t_ticket');
    await client.query('DELETE FROM t_file_attente');
    await client.query('DELETE FROM t_rendez_vous');
    await client.query('DELETE FROM t_utilisateur');
    await client.query('DELETE FROM t_hopital');
    await client.query("SELECT setval(pg_get_serial_sequence('t_utilisateur', 'id_utilisateur'), 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('t_hopital', 'id_hopital'), 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('t_file_attente', 'id_file'), 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('t_ticket', 'id_ticket'), 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('t_cas_urgence', 'id_urgence'), 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('t_rendez_vous', 'id_rdv'), 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('t_journal_activite', 'id_journal'), 1, false)");

    const demoHash = await hash(DEMO_PASSWORD);
    const adminHash = await hash(ADMIN_PASSWORD);

    // ── Utilisateurs ───────────────────────────────────────
    const users = [
      // Admin
      { nom: 'Rabe', prenom: 'Hery', email: 'admin@tsiry.mg', hash: adminHash, role: 'ADMIN', matricule: null, specialite: null, num_secu: null, tel: '0341234567' },
      // Patients
      { nom: 'Rasoa', prenom: 'Nomena', email: 'nomena.rasoa@demo.mg', hash: demoHash, role: 'PATIENT', matricule: null, specialite: null, num_secu: '101010101012345', tel: '0342345678' },
      { nom: 'Rajao', prenom: 'Hanta', email: 'hanta.rajao@demo.mg', hash: demoHash, role: 'PATIENT', matricule: null, specialite: null, num_secu: '202020202012345', tel: '0343456789' },
      { nom: 'Andrianarivelo', prenom: 'Tojo', email: 'tojo.andria@demo.mg', hash: demoHash, role: 'PATIENT', matricule: null, specialite: null, num_secu: '303030303012345', tel: '0344567890' },
      // Médecins
      { nom: 'Rakotomalala', prenom: 'Hery', email: 'hery.rakoto@demo.mg', hash: demoHash, role: 'MEDECIN', matricule: 'MED001', specialite: 'Cardiologie', num_secu: null, tel: '0345678901' },
      { nom: 'Ramanantoanina', prenom: 'Fara', email: 'fara.ramana@demo.mg', hash: demoHash, role: 'MEDECIN', matricule: 'MED002', specialite: 'Pédiatrie', num_secu: null, tel: '0346789012' },
      { nom: 'Razafindrabe', prenom: 'Lalao', email: 'lalao.razafi@demo.mg', hash: demoHash, role: 'MEDECIN', matricule: 'MED003', specialite: 'Dermatologie', num_secu: null, tel: '0347890123' },
      // Agents
      { nom: 'Razafindramampy', prenom: 'Feno', email: 'feno.razafi@demo.mg', hash: demoHash, role: 'AGENT', matricule: 'AGT001', specialite: null, num_secu: null, tel: '0348901234' },
      { nom: 'Ratsimbazafy', prenom: 'Aina', email: 'aina.ratsimba@demo.mg', hash: demoHash, role: 'AGENT', matricule: 'AGT002', specialite: null, num_secu: null, tel: '0349012345' },
    ];

    for (const u of users) {
      await client.query(
        `INSERT INTO t_utilisateur (nom, prenom, telephone, email, password_hash, role_type, matricule, specialite, num_secu)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [u.nom, u.prenom, u.tel, u.email, u.hash, u.role, u.matricule, u.specialite, u.num_secu]
      );
    }
    console.log(`  [OK] ${users.length} utilisateurs créés`);

    // ── Hôpitaux ───────────────────────────────────────────
    const hopitaux = [
      { nom: 'CHU Joseph Raseta Befelatanana', lat: -18.8792, lon: 47.5079, type: 'CHU' },
      { nom: 'Hôpital Militaire d\'Antananarivo', lat: -18.9136, lon: 47.5361, type: 'Militaire' },
      { nom: 'Centre Hospitalier Soavinandriana', lat: -18.92, lon: 47.548, type: 'Public' },
      { nom: 'Clinique Ilafy', lat: -18.8985, lon: 47.521, type: 'Privé' },
      { nom: 'CHU Andranobevava', lat: -18.8694, lon: 47.5225, type: 'CHU' },
      { nom: 'Hôpital Réseau de Soavinandriana', lat: -18.9287, lon: 47.5512, type: 'Public' },
    ];

    for (const h of hopitaux) {
      await client.query(
        'INSERT INTO t_hopital (nom, latitude, longitude, type) VALUES ($1, $2, $3, $4)',
        [h.nom, h.lat, h.lon, h.type]
      );
    }
    console.log(`  [OK] ${hopitaux.length} hôpitaux créés`);

    // ── Rendez-vous ────────────────────────────────────────
    const rdvs = [
      { date: '2026-06-20 10:00:00', motif: 'Consultation de contrôle', patient: 2, medecin: 5 },
      { date: '2026-06-15 14:30:00', motif: 'Suivi cardiologie', patient: 3, medecin: 5 },
      { date: new Date(Date.now() + 900000).toISOString().slice(0, 19).replace('T', ' '), motif: 'Consultation rapide', patient: 4, medecin: 6 },
    ];

    for (const r of rdvs) {
      await client.query(
        'INSERT INTO t_rendez_vous (date_heure, motif, statut, id_patient, id_medecin) VALUES ($1, $2, $3, $4, $5)',
        [r.date, r.motif, 'PLANIFIE', r.patient, r.medecin]
      );
    }
    console.log(`  [OK] ${rdvs.length} rendez-vous créés`);

    // ── File d'attente + tickets ───────────────────────────
    const fileRes = await client.query(
      "INSERT INTO t_file_attente (date_du_jour) VALUES (CURRENT_DATE) RETURNING id_file"
    );
    const fileId = fileRes.rows[0].id_file;

    const tickets = [
      { num: 1, statut: 'EN_ATTENTE', nom: 'Rakoto', prenom: 'Jean', patient: null },
      { num: 2, statut: 'EN_ATTENTE', nom: 'Rabe', prenom: 'Marie', patient: null },
      { num: 3, statut: 'APPELE', nom: 'Andria', prenom: 'Paul', patient: null },
      { num: 4, statut: 'EN_ATTENTE', nom: 'Rasoa', prenom: 'Nomena', patient: 2 },
    ];

    for (const t of tickets) {
      await client.query(
        'INSERT INTO t_ticket (numero, id_file, statut, patient_nom, patient_prenom, id_patient) VALUES ($1, $2, $3, $4, $5, $6)',
        [t.num, fileId, t.statut, t.nom, t.prenom, t.patient]
      );
    }
    console.log(`  [OK] ${tickets.length} tickets créés`);

    // ── Journal d'activité ─────────────────────────────────
    const logs = [
      { action: 'LOGIN', details: 'Connexion administrateur', userId: 1 },
      { action: 'USER_CREATED', details: 'Création du compte nomena.rasoa@demo.mg', userId: 1 },
      { action: 'HOSPITAL_CREATED', details: 'Ajout CHU Joseph Raseta Befelatanana', userId: 1 },
      { action: 'SEED_EXECUTED', details: 'Données de seed insérées', userId: 1 },
    ];

    for (const l of logs) {
      await client.query(
        'INSERT INTO t_journal_activite (action, details, id_utilisateur) VALUES ($1, $2, $3)',
        [l.action, l.details, l.userId]
      );
    }
    console.log(`  [OK] ${logs.length} entrées de journal créées`);

    await client.query('COMMIT');
    console.log('\n[TERMINE] Seed terminé avec succès !');
    console.log('\nComptes de démonstration :');
    console.log(`  Admin   : admin@tsiry.mg / ${ADMIN_PASSWORD}`);
    console.log(`  Patient : nomena.rasoa@demo.mg / ${DEMO_PASSWORD}`);
    console.log(`  Médecin : hery.rakoto@demo.mg / ${DEMO_PASSWORD}`);
    console.log(`  Agent   : feno.razafi@demo.mg / ${DEMO_PASSWORD}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ERREUR] Erreur lors du seed :', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
