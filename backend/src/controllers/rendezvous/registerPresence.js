const RendezVous = require('../../models/RendezVous');
const db = require('../../config/db'); //  Ajout nécessaire pour la requête atomique
const { evaluateTimeWindow } = require('../../services/rendezvous/timeWindow');

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

    // 2. Règle métier de validation temporelle (fonction pure, couverte par tests)
    const timeWindow = evaluateTimeWindow(new Date(rdv.date_heure), new Date());
    if (!timeWindow.ok) {
      const err = new Error(timeWindow.message);
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

    // 4. Enrichissement de la réponse avec les informations du patient (nom/prénom + heure)
    const detail = await db.query(
      `SELECT r.*, u.nom AS patient_nom, u.prenom AS patient_prenom
       FROM t_rendez_vous r
       JOIN t_utilisateur u ON r.id_patient = u.id_utilisateur
       WHERE r.id_rdv = $1`,
      [idRdv]
    );

    res.status(200).json(detail.rows[0] || result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { registerPresence };