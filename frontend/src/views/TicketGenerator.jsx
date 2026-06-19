import { useState } from 'react';
import toast from 'react-hot-toast';
import { generateTicket, getPatientsPresent } from '../services/ticketService.js';

export default function TicketGenerator({ onTicketGenerated }) {
  const [patient, setPatient] = useState({ patient_nom: '', patient_prenom: '' });
  const [patientsPresent, setPatientsPresent] = useState([]);
  const [showPresentList, setShowPresentList] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadPatientsPresent() {
    try {
      const response = await getPatientsPresent();
      if (response.success && response.data?.length) {
        setPatientsPresent(response.data);
        setShowPresentList(true);
        setTimeout(() => setShowPresentList(false), 5000);
      }
    } catch {
      /* optional flux C3 */
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!patient.patient_nom || !patient.patient_prenom) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await generateTicket(patient);
      if (response.success) {
        toast.success(`Ticket #${response.data.numero} créé`);
        setPatient({ patient_nom: '', patient_prenom: '' });
        onTicketGenerated(response.data);
        loadPatientsPresent();
      } else {
        toast.error(response.message || 'Erreur lors de la création');
      }
    } catch {
      toast.error('Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Distribuer un ticket</h2>
      <p>Enregistrez un nouveau patient et générez son ticket d&apos;attente.</p>

      {showPresentList && patientsPresent.length > 0 && (
        <div className="present-list-banner">
          <strong>Patients présents sur site :</strong>
          <ul>
            {patientsPresent.slice(0, 3).map((p, idx) => (
              <li key={idx}>
                {p.patient_nom} {p.patient_prenom}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patient_nom">Nom du patient</label>
          <input
            id="patient_nom"
            type="text"
            className="form-input"
            value={patient.patient_nom}
            onChange={(e) => setPatient({ ...patient, patient_nom: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="patient_prenom">Prénom du patient</label>
          <input
            id="patient_prenom"
            type="text"
            className="form-input"
            value={patient.patient_prenom}
            onChange={(e) => setPatient({ ...patient, patient_prenom: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Génération en cours…' : 'Distribuer un ticket'}
        </button>
      </form>
    </div>
  );
}
