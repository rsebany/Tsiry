const RendezVous = require('../models/RendezVous');

const AVANCE_MAX_MIN = 30;
const RETARD_MAX_MIN = 15;

async function bookAppointment(req, res, next) {
  try {
    const { id_patient, id_medecin, date_heure, motif } = req.body;

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
    const rendezvous = await RendezVous.findByPatient(idPatient);
    res.status(200).json(rendezvous);
  } catch (err) {
    next(err);
  }
}

async function registerPresence(req, res, next) {
  try {
    const idRdv = parseInt(req.params.id, 10);
    if (Number.isNaN(idRdv)) {
      const err = new Error('Identifiant de rendez-vous invalide.');
      err.status = 400;
      throw err;
    }

    const rdv = await RendezVous.findById(idRdv);
    if (!rdv) {
      const err = new Error('Rendez-vous introuvable.');
      err.status = 404;
      throw err;
    }

    if (rdv.statut !== 'PLANIFIE') {
      const err = new Error('Ce rendez-vous ne peut pas être enregistré (statut actuel : ' + rdv.statut + ').');
      err.status = 400;
      throw err;
    }

    const rdvDate = new Date(rdv.date_heure);
    const now = new Date();
    const rdvDay = rdvDate.toDateString();
    const today = now.toDateString();

    if (rdvDay !== today) {
      const err = new Error("Enregistrement refusé : votre rendez-vous n'est pas prévu aujourd'hui.");
      err.status = 400;
      throw err;
    }

    const diffMin = (rdvDate.getTime() - now.getTime()) / 60000;
    if (diffMin > AVANCE_MAX_MIN) {
      const err = new Error(`Enregistrement trop tôt. Veuillez revenir ${Math.ceil(diffMin - AVANCE_MAX_MIN)} min avant l'heure prévue.`);
      err.status = 400;
      throw err;
    }
    if (diffMin < -RETARD_MAX_MIN) {
      const err = new Error('Enregistrement refusé : délai de présentation dépassé. Dirigez-vous vers le guichet.');
      err.status = 400;
      throw err;
    }

    const updated = await RendezVous.updatePresence(idRdv);
    if (!updated) {
      const err = new Error('Impossible de mettre à jour le rendez-vous.');
      err.status = 409;
      throw err;
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { bookAppointment, listPatientAppointments, registerPresence };
