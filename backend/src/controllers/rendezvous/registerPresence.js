const RendezVous = require('../../models/RendezVous');
const db = require('../../config/db'); //  Ajout nécessaire pour la requête atomique

const AVANCE_MAX_MIN = 30;
const RETARD_MAX_MIN = 15;

async function registerPresence(req, res, next) {
  try {
    const idRdv = parseInt(req.params.id, 10);
    if (Number.isNaN(idRdv)) {
      const err = new Error('Identifiant de rendez-vous invalide.');
      err.status = 400;
      throw err;
    }

    // 1. Lecture des informations pour les vérifications de temps
    const rdv = await RendezVous.findById(idRdv);
    if (!rdv) {
      const err = new Error('Rendez-vous introuvable.');
      err.status = 404;
      throw err;
    }

    // Vérification rapide du statut initial
    if (rdv.statut !== 'PLANIFIE') {
      const err = new Error('Ce rendez-vous ne peut pas être enregistré (statut actuel : ' + rdv.statut + ').');
      err.status = 400;
      throw err;
    }

    // 2. Tes règles métier de validation temporelle
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

    // 3. Mise à jour Atomique et Sécurisée
    // Remplace l'appel `await RendezVous.updatePresence(idRdv)` pour éviter les conflits concourants
    const updateQuery = `
      UPDATE t_rendez_vous 
      SET statut = 'PRESENT'
      WHERE id_rdv = $1 AND statut = 'PLANIFIE'
      RETURNING *;
    `;
    const result = await db.query(updateQuery, [idRdv]);

    // Si aucune ligne n'est retournée, le statut a changé entre la lecture et l'écriture (ex: double clic/scan)
    if (result.rows.length === 0) {
      const err = new Error('Impossible de valider la présence : le rendez-vous a déjà été traité ou annulé.');
      err.status = 409;
      throw err;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { registerPresence };