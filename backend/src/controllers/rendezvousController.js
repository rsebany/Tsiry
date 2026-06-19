const RendezVous = require('../models/RendezVous');

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

module.exports = { bookAppointment };
