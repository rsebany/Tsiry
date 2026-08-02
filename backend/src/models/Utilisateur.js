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

async function create({ nom, prenom, telephone, email, passwordHash, num_secu, roleType = 'PATIENT' }) {
  const { rows } = await pool.query(
    `INSERT INTO t_utilisateur (nom, prenom, telephone, email, password_hash, role_type, num_secu)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id_utilisateur, nom, prenom, email, role_type, num_secu`,
    [nom, prenom, telephone || null, email, passwordHash, roleType, num_secu || null]
  );
  return rows[0];
}

async function updatePassword(id, passwordHash) {
  await pool.query(
    `UPDATE t_utilisateur SET password_hash = $1 WHERE id_utilisateur = $2`,
    [passwordHash, id]
  );
}

module.exports = {
  findByEmail,
  findById,
  findSpecialites,
  findMedecins,
  findPatients,
  create,
  updatePassword,
};
