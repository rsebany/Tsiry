import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { generateTicket, getPatientsPresent } from '../services/ticketService.js';

export default function TicketGenerator({ onTicketGenerated }) {
  const [patient, setPatient] = useState({ patient_nom: '', patient_prenom: '', id_patient: null });
  const [patientsPresent, setPatientsPresent] = useState([]);
  const [selectedPresent, setSelectedPresent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPatientsPresent()
      .then((response) => {
        if (response.success && response.data) {
          setPatientsPresent(response.data);
        }
      })
      .catch(() => {});
  }, []);

  function handleSelectPresent(e) {
    const value = e.target.value;
    setSelectedPresent(value);
    if (!value) {
      setPatient({ patient_nom: '', patient_prenom: '', id_patient: null });
      return;
    }
    const found = patientsPresent.find((p) => String(p.id_rdv) === value);
    if (found) {
      setPatient({
        patient_nom: found.patient_nom,
        patient_prenom: found.patient_prenom,
        id_patient: found.id_patient || null,
      });
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
        setPatient({ patient_nom: '', patient_prenom: '', id_patient: null });
        setSelectedPresent('');
        onTicketGenerated(response.data);
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
      <p>Enregistrez un patient présent sur site ou saisissez manuellement.</p>

      {patientsPresent.length > 0 && (
        <div className="form-group">
          <label htmlFor="present_select">Patients présents (UC3)</label>
          <select
            id="present_select"
            className="form-select"
            value={selectedPresent}
            onChange={handleSelectPresent}
            disabled={loading}
          >
            <option value="">— Sélectionner un patient présent —</option>
            {patientsPresent.map((p) => (
              <option key={p.id_rdv} value={p.id_rdv}>
                {p.patient_prenom} {p.patient_nom} (RDV #{p.id_rdv})
              </option>
            ))}
          </select>
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
