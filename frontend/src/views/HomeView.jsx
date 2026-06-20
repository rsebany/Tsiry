import React, { useState, useEffect } from 'react';

// Icônes PNG de l'application administrative
import iconHopital from '../assets/icons/hopital.png';
import iconTicket from '../assets/icons/ticket.png';
import iconNouveauPatient from '../assets/icons/nouveau-patient.png';

export default function HomeView() {
  // États pour la gestion des onglets et de l'affichage
  const [activePatient, setActivePatient] = useState(null);
  const [activeTab, setActiveTab] = useState('with-rdv'); // 'with-rdv' ou 'no-rdv'
  const [backendStatus, setBackendStatus] = useState({ loading: true, message: 'Vérification de la liaison réseau...', ready: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  // Formulaire A : Enregistrement d'un patient avec convocation pré-existante
  const [patientId, setPatientId] = useState('');

  // Formulaire B : Saisie administrative d'un patient sans rendez-vous préalable (Ajout de la date de naissance)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    telephone: ''
  });

  // Vérification de la connexion avec le Backend au chargement de la page
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBackendStatus({ loading: false, message: 'Liaison opérationnelle — Serveur prêt', ready: true });
        } else {
          setBackendStatus({ loading: false, message: 'Erreur de protocole réseau (Réponse API non valide)', ready: false });
        }
      })
      .catch(() => {
        setBackendStatus({ loading: false, message: 'Échec de la transaction réseau (Veuillez vérifier le serveur d\'accueil)', ready: false });
      });
  }, []);

  // ── Déclencheur d'impression — SOURCE UNIQUE DE VÉRITÉ (NON MODIFIÉ) ──────────────────────
  useEffect(() => {
    if (!ticketData || !activePatient) return;

    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        window.print();
        setPatientId('');
        setFormData({ nom: '', prenom: '', dateNaissance: '', telephone: '' });
      });
    });

    return () => { cancelled = true; };
  }, [ticketData, activePatient]);

  // Gestion des changements des champs du formulaire sans RDV
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumission globale (Enregistrement et Génération de Ticket)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    setTicketData(null);
    setActivePatient(null);

    const payload = activeTab === 'with-rdv'
      ? { id_utilisateur: parseInt(patientId, 10) }
      : { 
          nom: formData.nom, 
          prenom: formData.prenom, 
          date_naissance: formData.dateNaissance, // Prêt pour l'envoi au backend
          telephone: formData.telephone 
        };

    try {
      const response = await fetch('/api/tickets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: "L'admission a été enregistrée avec succès. Impression du ticket d'orientation en cours." });
        setTicketData(result.data.ticket);
        setActivePatient(result.data.patient);
      } else {
        setMessage({ type: 'error', text: result.message || "Erreur lors de la validation du dossier d'admission." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: "Impossible d'établir la communication avec le serveur distant d'accueil." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto', padding: '24px', fontFamily: "'Inter', 'Roboto', 'Open Sans', sans-serif", color: '#0f172a' }}>

      {/* En-tête de l'application administrative */}
      {/* En-tête de l'application administrative */}
<header className="no-print" style={{ 
  textAlign: 'center', 
  marginBottom: '32px', 
  borderBottom: '1px solid #e2e8f0', 
  paddingBottom: '20px' 
}}>
  <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
    <img src={iconHopital} alt="" style={{ width: '44px', height: '44px' }} />
    Système de Gestion Hospitalière
  </h1>
  <p style={{ fontSize: '15px', color: '#475569', fontWeight: '500', margin: 0 }}>
    Interface de l'Agent d'Accueil — Gestion des Admissions
  </p>
</header>

      {/* État de la connexion de l'API */}
      <section className="no-print" style={{ 
        background: backendStatus.ready ? '#f0fdf4' : '#fef2f2', 
        border: `1.5px solid ${backendStatus.ready ? '#bbf7d0' : '#fecaca'}`, 
        padding: '12px 16px', 
        borderRadius: '6px', 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span style={{ fontWeight: '700', fontSize: '14px', color: backendStatus.ready ? '#166534' : '#991b1b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          Statut de l'API :
        </span>
        <span style={{ color: backendStatus.ready ? '#15803d' : '#b91c1c', fontSize: '14px', fontWeight: '600' }}>
          {backendStatus.message}
        </span>
      </section>

      {/* Système d'onglets */}
      <div className="no-print" style={{ display: 'flex', marginBottom: '24px', gap: '12px' }}>
        <button
          type="button"
          onClick={() => { setActiveTab('with-rdv'); setMessage(null); }}
          style={{ 
            flex: 1, 
            padding: '14px', 
            cursor: 'pointer', 
            border: `1.5px solid ${activeTab === 'with-rdv' ? '#2563eb' : '#cbd5e1'}`, 
            borderRadius: '6px', 
            fontWeight: '700', 
            fontSize: '14px',
            backgroundColor: activeTab === 'with-rdv' ? '#2563eb' : '#ffffff', 
            color: activeTab === 'with-rdv' ? '#ffffff' : '#475569', 
            transition: 'all 0.2s ease', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px' 
          }}
        >
          <img src={iconTicket} alt="" style={{ width: '24px', height: '24px', filter: activeTab === 'with-rdv' ? 'brightness(0) invert(1)' : 'none' }} />
          Patient avec Rendez-vous
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('no-rdv'); setMessage(null); }}
          style={{ 
            flex: 1, 
            padding: '14px', 
            cursor: 'pointer', 
            border: `1.5px solid ${activeTab === 'no-rdv' ? '#16a34a' : '#cbd5e1'}`, 
            borderRadius: '6px', 
            fontWeight: '700', 
            fontSize: '14px',
            backgroundColor: activeTab === 'no-rdv' ? '#16a34a' : '#ffffff', 
            color: activeTab === 'no-rdv' ? '#ffffff' : '#475569', 
            transition: 'all 0.2s ease', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px' 
          }}
        >
          <img src={iconNouveauPatient} alt="" style={{ width: '24px', height: '24px', filter: activeTab === 'no-rdv' ? 'brightness(0) invert(1)' : 'none' }} />
          Nouveau Patient
        </button>
      </div>

      {/* Corps du formulaire d'accueil */}
      <div className="no-print" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '28px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <form onSubmit={handleSubmit}>

          {activeTab === 'with-rdv' ? (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Vérification et émargement de la convocation</h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Identifiant unique du patient (ID Patient) :</label>
                <input
                  type="number"
                  placeholder="Exemple : 99"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Saisie administrative du dossier d'admission</h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Nom de famille :</label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Saisissez le nom de famille"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Prénom :</label>
                <input
                  type="text"
                  name="prenom"
                  placeholder="Saisissez le prénom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              {/* Champ ajouté : Date de naissance pour la conformité et l'identitovigilance SIH */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Date de naissance :</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Coordonnées téléphoniques :</label>
                <input
                  type="text"
                  name="telephone"
                  placeholder="Ex : 0601020304"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !backendStatus.ready}
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: !backendStatus.ready ? '#94a3b8' : (activeTab === 'with-rdv' ? '#2563eb' : '#16a34a'), 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: '700', 
              fontSize: '15px', 
              cursor: loading || !backendStatus.ready ? 'not-allowed' : 'pointer', 
              marginTop: '8px', 
              transition: 'background-color 0.2s ease',
              letterSpacing: '0.2px'
            }}
          >
            {loading ? 'Traitement et validation en cours...' : "Valider l'entrée & Attribuer un numéro"}
          </button>
        </form>

        {message && (
          <div style={{ 
            marginTop: '20px', 
            padding: '14px 16px', 
            borderRadius: '6px', 
            fontSize: '14px',
            fontWeight: '600', 
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2', 
            color: message.type === 'success' ? '#15803d' : '#b91c1c', 
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` 
          }}>
            {message.text}
          </div>
        )}
      </div>

      {/* 🖨️ BLOC TICKET IMPRIMABLE */}
      {ticketData && activePatient && (
        <div className="print-only">
          <div className="ticket-container" style={{
            textAlign: 'center',
            padding: '4px 2px',
            width: '50mm',
            maxWidth: '50mm',
            margin: '0 auto',
            fontFamily: "'Courier New', Courier, monospace",
            color: '#000000',
          }}>
            <h2 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>HÔPITAL CENTRAL</h2>
            <p style={{ margin: '0 0 6px 0', fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold' }}>Ticket d'orientation Patient</p>
            <p style={{ margin: '0', fontSize: '10px' }}>--------------------------------</p>
            <div style={{ margin: '6px 0', fontSize: '10px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '4px', lineHeight: '1.6' }}>
              <div>REF OPÉRATION : {activePatient.id}</div>
              <div style={{ textTransform: 'uppercase', wordBreak: 'break-word' }}>
                PATIENT : {activePatient.nom} {activePatient.prenom}
              </div>
            </div>
            <p style={{ margin: '0', fontSize: '10px' }}>--------------------------------</p>
            <div style={{ margin: '8px 0' }}>
              <h1 style={{ fontSize: '28px', margin: '2px 0', fontWeight: 'bold' }}>N° {ticketData.numero}</h1>
              <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '4px 0', textTransform: 'uppercase' }}>STATUT : PRÉSENT</p>
            </div>
            <p style={{ margin: '0', fontSize: '10px' }}>--------------------------------</p>
            <p style={{ fontSize: '8px' , lineHeight: '1.4', margin: '6px 0', textAlign: 'justify', padding: '0 2px' }}>
              Veuillez patienter en salle d'attente.<br />
              Votre numéro d'ordre sera appelé sur les écrans de signalisation.
            </p>
            <p style={{ fontSize: '7px', margin: '6px 0 0 0', borderTop: '1px dashed #000', paddingTop: '4px' }}>
              Enregistré le : {new Date(ticketData.heure_creation).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* CSS d'impression */}
      <style>{`
        .print-only { display: none; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }
          @page { size: 58mm auto; margin: 2mm; }
        }
      `}</style>
    </div>
  );
}