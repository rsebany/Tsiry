import { useState, useEffect } from 'react';
import ticketService from '../services/api';

const TicketStatusView = ({ ticketId }) => {
    const [data, setData] = useState(null);
    const [erreur, setErreur] = useState(null);

    const fetchStatus = async () => {
        try {
            const result = await ticketService.getTicketStatus(ticketId);
            setData(result);
            setErreur(null);
        } catch (err) {
            setErreur('Erreur de connexion au serveur.');
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, [ticketId]);

    if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    if (!data) return <p>Chargement...</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Salle d'attente</h1>

            <div style={styles.card}>
                <p style={styles.label}>Votre numéro</p>
                <h2 style={styles.numero}>{data.numero}</h2>
            </div>

            <div style={styles.card}>
                <p style={styles.label}>Statut</p>
                <h3 style={styles.statut}>{data.statut}</h3>
            </div>

            <div style={{ ...styles.card, ...styles.highlight }}>
                <p style={styles.message}>{data.message}</p>
            </div>

            <p style={styles.refresh}>Mise à jour automatique toutes les 10 secondes</p>
        </div>
    );
};

const styles = {
    container: { maxWidth: 400, margin: '0 auto', padding: 20, textAlign: 'center', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '1.5rem', color: '#2d3748', marginBottom: 20 },
    card: { background: 'white', borderRadius: 12, padding: 20, marginBottom: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    label: { fontSize: '0.85rem', color: '#718096', marginBottom: 8 },
    numero: { fontSize: '3rem', color: '#3182ce' },
    statut: { fontSize: '1.2rem', color: '#38a169' },
    highlight: { background: '#ebf8ff', borderLeft: '4px solid #3182ce' },
    message: { fontSize: '1rem', color: '#2b6cb0', fontWeight: 'bold' },
    refresh: { fontSize: '0.75rem', color: '#a0aec0', marginTop: 10 },
};

export default TicketStatusView;
