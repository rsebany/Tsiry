const RendezVous = require('../models/RendezVous');

async function bookAppointment(req, res, next) {
  try {
    let { id_patient, id_medecin, date_heure, motif } = req.body;

    if (req.user?.role === 'PATIENT') {
      id_patient = req.user.id;
    }

    if (!id_patient || !id_medecin || !date_heure) {
      const err = new Error('Les champs id_patient, id_medecin et date_heure sont obligatoires.');
      err.status = 400;
      throw err;
    }

    const conflict = await RendezVous.findConflict(id_medecin, date_heure);
    if (conflict) {
      const err = new Error('Ce créneau est déjà réservé pour ce médecin.');
      err.status = 409;
      throw err;
    }

    const rdv = await RendezVous.create({ id_patient, id_medecin, date_heure, motif });
    res.status(201).json(rdv);
  } catch (err) {
    next(err);
  }
}

async function listPatientAppointments(req, res, next) {
  try {
    const idPatient = parseInt(req.params.id, 10);
    if (Number.isNaN(idPatient)) {
      const err = new Error("Format d'identifiant patient invalide.");
      err.status = 400;
      throw err;
    }

    if (req.user?.role === 'PATIENT' && req.user.id !== idPatient) {
      const err = new Error('Accès non autorisé à ces rendez-vous.');
      err.status = 403;
      throw err;
    }

    const rendezvous = await RendezVous.findByPatient(idPatient);
    res.status(200).json(rendezvous);
  } catch (err) {
    next(err);
  }
}

module.exports = { bookAppointment, listPatientAppointments };
