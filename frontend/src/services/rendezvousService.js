// Pour l'instant, on utilise l'API native 'fetch' de JavaScript car je ne sais pas encore quelle techno utiliser

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchPatientAppointments = async (idPatient) => {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${idPatient}/rendezvous`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data; // Retourne le tableau (rempli ou vide)
        
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous :", error);
        throw error;
    }
};