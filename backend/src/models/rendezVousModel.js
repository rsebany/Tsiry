// Cette requete recupere l'historique du patient connecter
// On importe le pool de connexion configuré dans ton projet
const db = require('../config/db');

const getHistoriquePatient = async (idPatient) => {
    // La requête SQL avec jointure pour récupérer les infos du médecin
    const query = `
        SELECT r.id_rdv, r.date_heure, r.motif, r.statut, 
               u.nom AS nom_medecin, u.prenom AS prenom_medecin, u.specialite
        FROM t_rendez_vous r
        JOIN t_utilisateur u ON r.id_medecin = u.id_utilisateur
        WHERE r.id_patient = $1
        ORDER BY r.date_heure DESC;
    `;
    
    // Le tableau values remplace dynamiquement le $1 dans la requête
    const values = [idPatient];
    
    // laisse sql executer la requete puis mais affect dans resultat
    const result = await db.query(query, values);
    return result.rows; // On retourne uniquement le tableau de données
};

module.exports = { getHistoriquePatient };