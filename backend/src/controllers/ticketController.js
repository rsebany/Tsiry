const pool = require('../config/db');

/**
 * UC4 / UC5 : Enregistrer un patient et lui attribuer un numéro de ticket
 * Gère le patient avec ou sans rendez-vous préalable
 */
const generateTicket = async (req, res) => {
    // 1. Extraction de la nouvelle propriété date_naissance depuis le corps de la requête
    const { nom, prenom, telephone, date_naissance, id_utilisateur, mode_enregistrement } = req.body;

    try {
        let patientId = id_utilisateur;

        // ÉTAPE 1 : Si le patient n'a pas d'ID (enregistrement au guichet jour le jour)
        // On le crée d'abord dans t_utilisateur (Rôle de Jess / UC4)
        if (!patientId) {
            // Conformément à l'identitovigilance SIH, la date de naissance devient aussi obligatoire
            if (!nom || !prenom || !date_naissance) {
                return res.status(400).json({
                    success: false,
                    message: "Le nom, le prénom et la date de naissance sont obligatoires pour un nouvel enregistrement."
                });
            }

            // Requête SQL enrichie pour intégrer la colonne date_naissance
            const newPatientQuery = `
                INSERT INTO t_utilisateur (nom, prenom, telephone, date_naissance, role_type)
                VALUES ($1, $2, $3, $4, 'PATIENT')
                RETURNING id_utilisateur
            `;
            
            // Passage ordonné des valeurs au connecteur pg (date_naissance se place sur le marqueur $4)
            const newPatientResult = await pool.query(newPatientQuery, [nom, prenom, telephone, date_naissance]);
            patientId = newPatientResult.rows[0].id_utilisateur;
        }

        // ÉTAPE 2 : Récupérer ou créer la file d'attente du jour (t_file_attente)
        let fileResult = await pool.query(
            "SELECT id_file FROM t_file_attente WHERE date_du_jour = CURRENT_DATE"
        );
        
        let idFile;
        if (fileResult.rows.length === 0) {
            const newFile = await pool.query(
                "INSERT INTO t_file_attente (date_du_jour) VALUES (CURRENT_DATE) RETURNING id_file"
            );
            idFile = newFile.rows[0].id_file;
        } else {
            idFile = fileResult.rows[0].id_file;
        }

        // ÉTAPE 3 : Calculer le prochain numéro de ticket pour aujourd'hui (Incrémentation automatique)
        const numeroQuery = `
            SELECT COALESCE(MAX(numero), 0) + 1 AS prochain_numero 
            FROM t_ticket 
            WHERE id_file = $1
        `;
        const numeroResult = await pool.query(numeroQuery, [idFile]);
        const prochainNumero = numeroResult.rows[0].prochain_numero;

        // ÉTAPE 4 : Insérer le ticket dans t_ticket (UC5)
        const ticketQuery = `
            INSERT INTO t_ticket (numero, statut, id_patient, id_file)
            VALUES ($1, 'EN_ATTENTE', $2, $3)
            RETURNING id_ticket, numero, heure_creation, statut, id_patient
        `;
        const ticketResult = await pool.query(ticketQuery, [prochainNumero, patientId, idFile]);
        const newTicket = ticketResult.rows[0];

        // 🌟 NOUVEAU : Récupérer les informations d'identité réelles du patient depuis t_utilisateur
        const patientDataQuery = `
            SELECT nom, prenom FROM t_utilisateur WHERE id_utilisateur = $1
        `;
        const patientDataResult = await pool.query(patientDataQuery, [patientId]);
        const patientProfile = patientDataResult.rows[0];

        // Format de réponse JSON standardisé enrichi avec les vraies données de la base
        return res.status(201).json({
            success: true,
            data: {
                ticket: newTicket,
                patient: {
                    id: newTicket.id_patient,
                    nom: patientProfile.nom,
                    prenom: patientProfile.prenom
                }
            },
            message: `Ticket numéro ${prochainNumero} généré avec succès.`
        });

    } catch (error) {
        console.error("Erreur lors de la génération du ticket:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur lors de la génération du ticket."
        });
    }
};

module.exports = {
    generateTicket
};