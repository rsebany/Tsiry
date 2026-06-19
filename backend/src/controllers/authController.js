const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

const JWT_EXPIRES_IN = '8h';

function formatUser(row) {
  return {
    id: row.id_utilisateur,
    nom: row.nom,
    prenom: row.prenom,
    role: row.role_type,
    email: row.email,
    specialite: row.specialite || undefined,
    matricule: row.matricule || undefined,
    num_secu: row.num_secu || undefined,
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id_utilisateur, role: user.role_type, email: user.email },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('Email et mot de passe requis.');
      err.status = 400;
      throw err;
    }

    const user = await Utilisateur.findByEmail(email);
    if (!user) {
      const err = new Error('Identifiants invalides.');
      err.status = 401;
      throw err;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      const err = new Error('Identifiants invalides.');
      err.status = 401;
      throw err;
    }

    const token = signToken(user);
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await Utilisateur.findById(req.user.id);
    if (!user) {
      const err = new Error('Utilisateur introuvable.');
      err.status = 404;
      throw err;
    }
    res.json({ user: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me };
