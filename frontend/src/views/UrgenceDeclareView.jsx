import { useState } from 'react';
import toast from 'react-hot-toast';
import { declarerUrgence } from '../services/urgenceService.js';

const PRIORITY_LABELS = {
  ROUGE: 'Critique — prise en charge immédiate',
  ORANGE: 'Urgent — surveillance rapprochée',
  JAUNE: 'Modéré',
  VERT: 'Stable',
};

export default function UrgenceDeclareView() {
  const [form, setForm] = useState({
    id_patient: '1',
    pouls: '',
    tension_systolique: '',
    saturation_o2: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await declarerUrgence({
        id_patient: parseInt(form.id_patient, 10),
        pouls: parseInt(form.pouls, 10),
        tension_systolique: parseInt(form.tension_systolique, 10),
        saturation_o2: parseInt(form.saturation_o2, 10),
      });
      setResult(response.data);
      if (response.alerte) {
        toast.error(`Alerte ${response.data.niveau_priorite}`, { duration: 5000 });
      } else {
        toast.success('Cas enregistré');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la déclaration');
    } finally {
      setLoading(false);
    }
  }

  const priority = result?.niveau_priorite;
  const isAlert = priority === 'ROUGE' || priority === 'ORANGE';

  return (
    <section className="card">
      <h2>Déclaration d&apos;urgence</h2>
      <p>Saisie des constantes vitales pour triage automatique (UC7 / UC8 — Orneda).</p>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_patient">ID patient</label>
          <input
            id="id_patient"
            name="id_patient"
            type="number"
            min="1"
            className="form-input"
            value={form.id_patient}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pouls">Pouls (bpm)</label>
          <input
            id="pouls"
            name="pouls"
            type="number"
            min="30"
            max="200"
            className="form-input"
            value={form.pouls}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tension_systolique">Tension systolique (mmHg)</label>
          <input
            id="tension_systolique"
            name="tension_systolique"
            type="number"
            min="60"
            max="250"
            className="form-input"
            value={form.tension_systolique}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="saturation_o2">Saturation O₂ (%)</label>
          <input
            id="saturation_o2"
            name="saturation_o2"
            type="number"
            min="70"
            max="100"
            className="form-input"
            value={form.saturation_o2}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Analyse en cours…' : 'Déclarer le cas'}
        </button>
      </form>

      {result && (
        <div className={`urgence-result urgence-result--${priority?.toLowerCase()}`}>
          <p className="urgence-result-title">
            Priorité : <strong>{priority}</strong>
          </p>
          <p>{PRIORITY_LABELS[priority]}</p>
          {isAlert && (
            <p className="urgence-alert">
              Alerte activée — le patient sera priorisé dans la file d&apos;attente.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
