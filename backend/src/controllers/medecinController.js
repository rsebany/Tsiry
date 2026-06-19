const Utilisateur = require('../models/Utilisateur');

async function listSpecialites(_req, res, next) {
  try {
    const specialites = await Utilisateur.findSpecialites();
    res.json(specialites);
  } catch (err) {
    next(err);
  }
}

async function listMedecins(req, res, next) {
  try {
    const { specialite } = req.query;
    const medecins = await Utilisateur.findMedecins({ specialite });
    res.json(medecins);
  } catch (err) {
    next(err);
  }
}

async function listPatients(_req, res, next) {
  try {
    const patients = await Utilisateur.findPatients();
    res.json(patients);
  } catch (err) {
    next(err);
  }
}

module.exports = { listSpecialites, listMedecins, listPatients };
