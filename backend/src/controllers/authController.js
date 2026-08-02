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

async function register(req, res, next) {
  try {
    const { nom, prenom, email, password, telephone, num_secu } = req.body;

    if (!nom || !prenom || !email || !password) {
      const err = new Error('Nom, prénom, email et mot de passe sont requis.');
      err.status = 400;
      throw err;
    }
    if (typeof password !== 'string' || password.length < 6) {
      const err = new Error('Le mot de passe doit contenir au moins 6 caractères.');
      err.status = 400;
      throw err;
    }

    const existing = await Utilisateur.findByEmail(email);
    if (existing) {
      const err = new Error('Un compte existe déjà avec cet email.');
      err.status = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await Utilisateur.create({ nom, prenom, telephone, email, passwordHash, num_secu });

    const token = signToken(user);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      const err = new Error('Email requis.');
      err.status = 400;
      throw err;
    }

    const user = await Utilisateur.findByEmail(email);
    if (!user) {
      // Ne pas révéler l'existence du compte.
      return res.json({
        message: 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.',
      });
    }

    const resetToken = jwt.sign(
      { sub: user.id_utilisateur, purpose: 'reset-password' },
      process.env.JWT_SECRET || 'dev-secret-change-me',
      { expiresIn: '15m' }
    );

    const response = { message: 'Lien de réinitialisation envoyé par email.' };
    // Hors production : renvoyer le jeton pour permettre le reset sans serveur mail.
    if (process.env.NODE_ENV !== 'production') {
      response.resetToken = resetToken;
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      const err = new Error('Jeton et nouveau mot de passe requis.');
      err.status = 400;
      throw err;
    }
    if (typeof password !== 'string' || password.length < 6) {
      const err = new Error('Le mot de passe doit contenir au moins 6 caractères.');
      err.status = 400;
      throw err;
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    } catch {
      const err = new Error('Jeton invalide ou expiré.');
      err.status = 400;
      throw err;
    }
    if (payload.purpose !== 'reset-password') {
      const err = new Error('Jeton invalide.');
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await Utilisateur.updatePassword(payload.sub, passwordHash);
    res.json({ message: 'Mot de passe mis à jour. Vous pouvez vous connecter.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me, register, forgotPassword, resetPassword };
