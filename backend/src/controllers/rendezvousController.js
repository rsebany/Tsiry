const RendezVousModel = require('../models/rendezVousModel');

const getPatientAppointments = async (req, res) => {
    try {
        // 1. Sécurisation du paramètre d'entrée
        const idPatient = parseInt(req.params.id, 10);

        if (isNaN(idPatient)) {
            return res.status(400).json({ error: "Format d'identifiant patient invalide." });
        }

        // 2. Appel au modèle
        const rendezvous = await RendezVousModel.getHistoriquePatient(idPatient);

        // 3. Gestion de la tolérance de données
        // Si PostgreSQL ne trouve rien, 'rendezvous' sera un tableau vide [] par défaut.
        // On renvoie directement ce tableau avec un statut http -> 200(OK)et en JSON .
        return res.status(200).json(rendezvous);

    } catch (error) {
        console.error("Erreur API Consulter RDV :", error);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

module.exports = { getPatientAppointments };