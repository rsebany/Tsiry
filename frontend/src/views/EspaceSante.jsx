import React, { useState, useEffect } from 'react';
// On importe les fonctions que nous avons créées dans service
import { fetchPatientAppointments } from '../services/rendezvousService';
import { checkIsEmptyState, getBadgeColorByStatus } from '../services/rendezvousUtils';

const EspaceSante = () => {
    // 1. Déclaration des états (State)
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulation de l'ID du patient connecté (en attendant que le module d'authentification soit prêt)
    const idPatientConnecte = 1; 

    // 2. Cycle de vie : Appel réseau au montage du composant
    useEffect(() => {
        const loadAppointments = async () => {
            try {
                // Appel de ton service Fetch asynchrone
                const data = await fetchPatientAppointments(idPatientConnecte);
                setAppointments(data);
            } catch (err) 
            {
                setError("Impossible de charger l'historique des rendez-vous.");
            } 
            finally 
            {
                setIsLoading(false); // On arrête le chargement quoi qu'il arrive
            }
        };

        loadAppointments();
    }, [idPatientConnecte]); // Le tableau vide/avec id garantit que ça s'exécute au montage

    // 3. Gestion de l'affichage (Render)
    
    // Cas de chargement
    if (isLoading) return <div>Chargement de vos données médicales...</div>;
    
    // Cas d'erreur réseau
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    // Cas "État vide" (Règle UC2 respectée)
    if (checkIsEmptyState(appointments)) {
        return (
            <div className="empty-state-container">
                <h2>Mon Espace Santé</h2>
                {/* Message bienveillant */}
                <p>Vous n'avez aucun rendez-vous planifié ou passé</p>
            </div>
        );
    }

    // Cas nominal : Le patient a des rendez-vous
    return (
        <div className="espace-sante-container">
            <h2>Mon Espace Santé</h2>
            
            <div className="appointments-list">
                {/* Boucle sur le tableau pour générer les cartes */}
                {appointments.map((rdv) => (
                    <div key={rdv.id_rdv} className="appointment-card" style={styles.card}>
                        
                        <div className="card-header" style={styles.header}>
                            <strong>Date : {new Date(rdv.date_heure).toLocaleDateString()}</strong>
                            <span> à {new Date(rdv.date_heure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            
                            {/* Logique visuelle des badges de statuts intégrée ici */}
                            <span style={{ 
                                ...styles.badge, 
                                backgroundColor: getBadgeColorByStatus(rdv.statut) 
                            }}>
                                {rdv.statut}
                            </span>
                        </div>
                        
                        <div className="card-body">
                            <p><strong>Médecin :</strong> Dr. {rdv.prenom_medecin} {rdv.nom_medecin}</p>
                            <p><strong>Spécialité :</strong> {rdv.specialite}</p>
                            <p><strong>Motif :</strong> {rdv.motif || 'Non précisé'}</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

// Objets de styles simples 
const styles = {
    card: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        marginBottom: '10px'
    },
    badge: {
        color: 'white',
        padding: '5px 10px',
        borderRadius: '12px',
        fontSize: '0.85em',
        fontWeight: 'bold'
    }
};

export default EspaceSante;