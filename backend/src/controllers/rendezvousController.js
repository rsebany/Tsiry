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
        // CORRECTION : Log adapté à cette fonction
        console.error("--- ERREUR CRITIQUE DANS getRendezVous ---");
        console.error("Message d'erreur:", error.message);
        console.error("Stack trace:", error.stack); 
        
        return res.status(500).json({ 
            message: "Erreur interne du serveur.",
            details: error.message
        });
    }
};

// ── PATCH /api/rendezvous/:id/register ──────────────────────────────────────
// Enregistre la présence d'un patient avec contrôle temporel
const registerPresence = async (req, res) => {
    try {
        const id_rdv = req.params.id;
        // On récupère la variable "force" envoyée par le frontend
        const { force } = req.body || {}; 

        // 1. Récupération préalable
        const checkQuery = 'SELECT date_heure, statut, id_patient FROM t_rendez_vous WHERE id_rdv = $1';
        const { rows } = await db.query(checkQuery, [id_rdv]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Rendez-vous inexistant." });
        }

        const rendezvous = rows[0];
        const rdvDate = new Date(rendezvous.date_heure);
        const maintenant = new Date();

        // Si la secrétaire n'a pas activé la dérogation (force), on applique les contrôles stricts
        if (!force) {
            // 2. Contrôle de la date (doit être le même jour)
            const estMemeJour =
                rdvDate.getFullYear() === maintenant.getFullYear() &&
                rdvDate.getMonth()    === maintenant.getMonth()    &&
                rdvDate.getDate()     === maintenant.getDate();

            if (!estMemeJour) {
                console.warn(`[400 BAD REQUEST] RDV ${id_rdv} refusé : Pas à la date d'aujourd'hui.`);
                return res.status(400).json({
                    message: "Le rendez-vous n'est pas prévu pour aujourd'hui."
                });
            }

            // 3. Contrôle de la marge horaire
            const differenceEnMinutes = (maintenant - rdvDate) / (1000 * 60);

            if (differenceEnMinutes < -30 || differenceEnMinutes > 15) {
                console.warn(`[400 BAD REQUEST] RDV ${id_rdv} refusé : Hors délais (${Math.round(differenceEnMinutes)} min).`);
                return res.status(400).json({
                    message: `Hors délais (${Math.round(differenceEnMinutes)} min). Autorisé : -30 min à +15 min.`
                });
            }
        }

        // 4. Succès — on applique la mutation
        let rdvMisAJour = await rendezvousModel.updateStatusToPresent(id_rdv);

        // SÉCURITÉ : Si rdvMisAJour est vide, c'est que le statut n'était plus 'PLANIFIE' (déjà PRESENT)
        if (!rdvMisAJour) {
            const fallbackQuery = 'SELECT * FROM t_rendez_vous WHERE id_rdv = $1';
            const fallbackRes = await db.query(fallbackQuery, [id_rdv]);
            rdvMisAJour = fallbackRes.rows[0];
        }

        // On retourne une réponse 200 positive pour que le frontend déclenche la suite (pop-up)
        return res.status(200).json({
            message: "Enregistrement réussi.",
            rendezvous: { ...rdvMisAJour, id_patient: rendezvous.id_patient } 
        });

    } catch (error) {
        console.error("--- ERREUR CRITIQUE DANS registerPresence ---");
        console.error("Message d'erreur:", error.message);
        console.error("Stack trace:", error.stack); 
        
        return res.status(500).json({ 
            message: "Erreur interne du serveur.",
            details: error.message
        });
    }
};

module.exports = {
    getRendezVous,
    registerPresence
};