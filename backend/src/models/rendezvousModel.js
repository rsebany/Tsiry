const db = require('../config/db'); // Importation de la connexion PostgreSQL

// Composant de mise à jour (PATCH)
const updateStatusToPresent = async (id_rdv) => {
    const query = `
        UPDATE t_rendez_vous
        SET statut = 'PRESENT'
        WHERE id_rdv = $1 AND statut = 'PLANIFIE'
        RETURNING *;
    `;
    
    const values = [id_rdv];
    const { rows } = await db.query(query, values);
    return rows[0]; // Renvoie le rendez-vous mis à jour
};

module.exports = {
    updateStatusToPresent
};