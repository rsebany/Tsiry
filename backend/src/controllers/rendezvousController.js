const rendezvousModel = require('../models/rendezvousModel');
const db = require('../config/db');

// ── GET /api/rendezvous/:id ──────────────────────────────────────────────────
// Récupère les infos d'un RDV pour affichage avant validation
const getRendezVous = async (req, res) => {
    try {
        const id_rdv = req.params.id;
        const query = 'SELECT * FROM t_rendez_vous WHERE id_rdv = $1';
        const { rows } = await db.query(query, [id_rdv]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Rendez-vous inexistant." });
        }

        return res.status(200).json(rows[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

// ── PATCH /api/rendezvous/:id/register ──────────────────────────────────────
// Enregistre la présence d'un patient avec contrôle temporel
const registerPresence = async (req, res) => {
    try {
        const id_rdv = req.params.id;

        // 1. Récupération préalable
        const checkQuery = 'SELECT date_heure, statut FROM t_rendez_vous WHERE id_rdv = $1';
        const { rows } = await db.query(checkQuery, [id_rdv]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Rendez-vous inexistant." });
        }

        const rendezvous = rows[0];
        const rdvDate = new Date(rendezvous.date_heure);
        const maintenant = new Date();

        // 2. Contrôle de la date (doit être le même jour)
        const estMemeJour =
            rdvDate.getFullYear() === maintenant.getFullYear() &&
            rdvDate.getMonth()    === maintenant.getMonth()    &&
            rdvDate.getDate()     === maintenant.getDate();

        if (!estMemeJour) {
            return res.status(400).json({
                message: "Refus d'enregistrement : Le rendez-vous n'est pas prévu pour aujourd'hui."
            });
        }

        // 3. Contrôle de la marge horaire (30 min d'avance max, 15 min de retard max)
        const differenceEnMinutes = (maintenant - rdvDate) / (1000 * 60);

        if (differenceEnMinutes < -30 || differenceEnMinutes > 15) {
            return res.status(400).json({
                message: "Refus d'enregistrement : Hors des marges horaires autorisées (30 min d'avance ou 15 min de retard maximum)."
            });
        }

        // 4. Succès — on applique la mutation
        const rdvMisAJour = await rendezvousModel.updateStatusToPresent(id_rdv);

        return res.status(200).json({
            message: "Enregistrement réussi. Veuillez vous installer en salle d'attente.",
            rendezvous: rdvMisAJour
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

module.exports = {
    getRendezVous,
    registerPresence
};