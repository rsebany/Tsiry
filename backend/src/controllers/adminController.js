const pool = require('../config/db');

// ── Statistiques système ───────────────────────────────────
async function getStats(req, res, next) {
  try {
    const [users, tickets, rdvs, urgences, hopitaux] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE actif = TRUE) AS actifs FROM t_utilisateur"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE statut = 'EN_ATTENTE') AS en_attente FROM t_ticket WHERE date_trunc('day', heure_creation) = CURRENT_DATE"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE statut = 'PLANIFIE') AS planifies FROM t_rendez_vous WHERE date_trunc('day', date_heure) = CURRENT_DATE"),
      pool.query("SELECT COUNT(*) AS total FROM t_cas_urgence WHERE date_trunc('day', date_declaration) = CURRENT_DATE"),
      pool.query('SELECT COUNT(*) AS total FROM t_hopital'),
    ]);

    res.json({
      success: true,
      data: {
        utilisateurs: { total: parseInt(users.rows[0].total), actifs: parseInt(users.rows[0].actifs) },
        tickets: { total: parseInt(tickets.rows[0].total), en_attente: parseInt(tickets.rows[0].en_attente) },
        rendez_vous: { total: parseInt(rdvs.rows[0].total), planifies: parseInt(rdvs.rows[0].planifies) },
        urgences: { total: parseInt(urgences.rows[0].total) },
        hopitaux: { total: parseInt(hopitaux.rows[0].total) },
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── Utilisateurs CRUD ─────────────────────────────────────
async function listUsers(req, res, next) {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const conditions = [];
    const params = [];
    let idx = 1;

    if (role && role !== 'ALL') {
      conditions.push(`role_type = $${idx++}`);
      params.push(role);
    }
    if (search) {
      conditions.push(`(nom ILIKE $${idx} OR prenom ILIKE $${idx} OR email ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await pool.query(`SELECT COUNT(*) FROM t_utilisateur ${where}`, params);
    const dataRes = await pool.query(
      `SELECT id_utilisateur, nom, prenom, email, telephone, role_type, matricule, specialite, num_secu, actif, cree_le
       FROM t_utilisateur ${where} ORDER BY id_utilisateur LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: dataRes.rows,
      pagination: {
        total: parseInt(countRes.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(parseInt(countRes.rows[0].count) / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id_utilisateur, nom, prenom, email, telephone, role_type, matricule, specialite, num_secu, actif, cree_le FROM t_utilisateur WHERE id_utilisateur = $1',
      [parseInt(id)]
    );
    if (result.rows.length === 0) {
      const err = new Error('Utilisateur introuvable');
      err.status = 404;
      throw err;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { nom, prenom, email, password, role_type, telephone, matricule, specialite, num_secu } = req.body;
    if (!nom || !prenom || !email || !password || !role_type) {
      const err = new Error('Champs requis : nom, prenom, email, password, role_type');
      err.status = 400;
      throw err;
    }
    if (!['PATIENT', 'AGENT', 'MEDECIN'].includes(role_type)) {
      const err = new Error('role_type doit être PATIENT, AGENT ou MEDECIN');
      err.status = 400;
      throw err;
    }

    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO t_utilisateur (nom, prenom, email, password_hash, role_type, telephone, matricule, specialite, num_secu)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_utilisateur, nom, prenom, email, role_type`,
      [nom, prenom, email, password_hash, role_type, telephone || null, matricule || null, specialite || null, num_secu || null]
    );

    await pool.query(
      'INSERT INTO t_journal_activite (action, details, id_utilisateur) VALUES ($1, $2, $3)',
      ['USER_CREATED', `Création de ${prenom} ${nom} (${role_type})`, req.user.id]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      const e = new Error('Un compte existe déjà avec cet email');
      e.status = 409;
      return next(e);
    }
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { nom, prenom, email, telephone, role_type, matricule, specialite, num_secu, actif } = req.body;

    const result = await pool.query(
      `UPDATE t_utilisateur SET
        nom = COALESCE($1, nom), prenom = COALESCE($2, prenom), email = COALESCE($3, email),
        telephone = COALESCE($4, telephone), role_type = COALESCE($5, role_type),
        matricule = $6, specialite = $7, num_secu = $8, actif = COALESCE($9, actif)
       WHERE id_utilisateur = $10
       RETURNING id_utilisateur, nom, prenom, email, role_type, actif`,
      [nom || null, prenom || null, email || null, telephone || null, role_type || null,
       matricule !== undefined ? matricule : null, specialite !== undefined ? specialite : null,
       num_secu !== undefined ? num_secu : null, actif !== undefined ? actif : null, parseInt(id)]
    );

    if (result.rows.length === 0) {
      const err = new Error('Utilisateur introuvable');
      err.status = 404;
      throw err;
    }

    await pool.query(
      'INSERT INTO t_journal_activite (action, details, id_utilisateur) VALUES ($1, $2, $3)',
      ['USER_UPDATED', `Mise à jour utilisateur #${id}`, req.user.id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE t_utilisateur SET actif = FALSE WHERE id_utilisateur = $1 RETURNING id_utilisateur, nom, prenom',
      [parseInt(id)]
    );
    if (result.rows.length === 0) {
      const err = new Error('Utilisateur introuvable');
      err.status = 404;
      throw err;
    }

    await pool.query(
      'INSERT INTO t_journal_activite (action, details, id_utilisateur) VALUES ($1, $2, $3)',
      ['USER_DEACTIVATED', `Désactivation de ${result.rows[0].prenom} ${result.rows[0].nom}`, req.user.id]
    );

    res.json({ success: true, message: 'Utilisateur désactivé' });
  } catch (err) {
    next(err);
  }
}

// ── Hôpitaux CRUD ─────────────────────────────────────────
async function listHospitals(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM t_hopital ORDER BY nom');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function createHospital(req, res, next) {
  try {
    const { nom, latitude, longitude, type } = req.body;
    if (!nom || latitude == null || longitude == null) {
      const err = new Error('Champs requis : nom, latitude, longitude');
      err.status = 400;
      throw err;
    }

    const result = await pool.query(
      'INSERT INTO t_hopital (nom, latitude, longitude, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, latitude, longitude, type || null]
    );

    await pool.query(
      'INSERT INTO t_journal_activite (action, details, id_utilisateur) VALUES ($1, $2, $3)',
      ['HOSPITAL_CREATED', `Ajout de ${nom}`, req.user.id]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateHospital(req, res, next) {
  try {
    const { id } = req.params;
    const { nom, latitude, longitude, type } = req.body;

    const result = await pool.query(
      `UPDATE t_hopital SET
        nom = COALESCE($1, nom), latitude = COALESCE($2, latitude),
        longitude = COALESCE($3, longitude), type = COALESCE($4, type)
       WHERE id_hopital = $5 RETURNING *`,
      [nom || null, latitude != null ? latitude : null, longitude != null ? longitude : null, type || null, parseInt(id)]
    );

    if (result.rows.length === 0) {
      const err = new Error('Hôpital introuvable');
      err.status = 404;
      throw err;
    }

    await pool.query(
      'INSERT INTO t_journal_activite (action, details, id_utilisateur) VALUES ($1, $2, $3)',
      ['HOSPITAL_UPDATED', `Mise à jour hôpital #${id}`, req.user.id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function deleteHospital(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM t_hopital WHERE id_hopital = $1 RETURNING nom', [parseInt(id)]);
    if (result.rows.length === 0) {
      const err = new Error('Hôpital introuvable');
      err.status = 404;
      throw err;
    }

    await pool.query(
      'INSERT INTO t_journal_activite (action, details, id_utilisateur) VALUES ($1, $2, $3)',
      ['HOSPITAL_DELETED', `Suppression de ${result.rows[0].nom}`, req.user.id]
    );

    res.json({ success: true, message: 'Hôpital supprimé' });
  } catch (err) {
    next(err);
  }
}

// ── Journal d'activité ────────────────────────────────────
async function listLogs(req, res, next) {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = await pool.query(
      `SELECT j.*, u.nom, u.prenom
       FROM t_journal_activite j
       LEFT JOIN t_utilisateur u ON j.id_utilisateur = u.id_utilisateur
       ORDER BY j.date_action DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats,
  listUsers, getUser, createUser, updateUser, deleteUser,
  listHospitals, createHospital, updateHospital, deleteHospital,
  listLogs,
};
