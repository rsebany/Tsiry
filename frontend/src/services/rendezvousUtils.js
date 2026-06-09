/**
 * Vérifie si le patient n'a aucun historique
 * Règle UC2 : Gestion de l'état vide au Frontend
 */
export const checkIsEmptyState = (appointmentsData) => {
    // Si le tableau reçu est vide (data.length === 0)
    return !appointmentsData || appointmentsData.length === 0;
};

/**
 * Associe le statut textuel de la base de données à la bonne couleur de badge
 * Règle UC2 : Logique visuelle des badges de statuts
 */
export const getBadgeColorByStatus = (statut) => {
    switch (statut) {
        case 'PLANIFIE':
            return 'blue';  // Badge couleur Bleue
        case 'PRESENT':
            return 'green'; // Badge couleur Verte
        case 'ANNULE':
            return 'red';   // Badge couleur Rouge
        default:
            return 'gray';
    }
};