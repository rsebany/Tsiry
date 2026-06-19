const pool = require('../config/db');

async function findByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id_utilisateur, nom, prenom, email, password_hash, role_type, matricule, specialite, num_secu
     FROM t_utilisateur WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id_utilisateur, nom, prenom, email, role_type, matricule, specialite, num_secu
     FROM t_utilisateur WHERE id_utilisateur = $1`,
    [id]
  );
  return rows[0] || null;
}

async function findSpecialites() {
  const { rows } = await pool.query(
    `SELECT DISTINCT specialite FROM t_utilisateur
     WHERE role_type = 'MEDECIN' AND specialite IS NOT NULL
     ORDER BY specialite`
  );
  return rows.map((r) => r.specialite);
}

async function findMedecins({ specialite } = {}) {
  let query = `SELECT id_utilisateur, nom, prenom, specialite
               FROM t_utilisateur
               WHERE role_type = 'MEDECIN'`;
  const params = [];

  if (specialite) {
    params.push(specialite);
    query += ` AND specialite = $1`;
  }

  query += ' ORDER BY nom, prenom';
  const { rows } = await pool.query(query, params);
  return rows;
}

async function findPatients() {
  const { rows } = await pool.query(
    `SELECT id_utilisateur, nom, prenom
     FROM t_utilisateur
     WHERE role_type = 'PATIENT'
     ORDER BY nom, prenom`
  );
  return rows;
}

module.exports = { findByEmail, findById, findSpecialites, findMedecins, findPatients };
