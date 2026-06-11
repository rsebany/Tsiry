import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  bookAppointment,
  fetchMedecins,
  fetchPatients,
  fetchSpecialites,
} from '../services/rendezvousService.js';

const INITIAL_FORM = {
  id_patient: '',
  specialite: '',
  id_medecin: '',
  date_heure: '',
  motif: '',
};

export default function BookAppointmentView() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [specialites, setSpecialites] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    Promise.all([fetchSpecialites(), fetchPatients()])
      .then(([specs, pts]) => {
        setSpecialites(specs);
        setPatients(pts);
        if (pts.length === 1) {
          setForm((prev) => ({ ...prev, id_patient: String(pts[0].id_utilisateur) }));
        }
      })
      .catch((err) => {
        setInitError(err.response?.data?.error || err.message || 'Impossible de charger les données.');
      });
  }, []);

  useEffect(() => {
    if (!form.specialite) {
      setMedecins([]);
      setForm((prev) => ({ ...prev, id_medecin: '' }));
      return;
    }

    fetchMedecins(form.specialite)
      .then((data) => {
        setMedecins(data);
        setForm((prev) => ({ ...prev, id_medecin: '' }));
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || 'Impossible de charger les médecins.');
      });
  }, [form.specialite]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      id_patient: Number(form.id_patient),
      id_medecin: Number(form.id_medecin),
      date_heure: new Date(form.date_heure).toISOString(),
      motif: form.motif || undefined,
    };

    try {
      const rdv = await bookAppointment(payload);
      setSuccess(rdv);
      setForm({
        ...INITIAL_FORM,
        ...(patients.length === 1
          ? { id_patient: String(patients[0].id_utilisateur) }
          : {}),
      });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Une erreur est survenue lors de la réservation.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const isFormValid =
    form.id_patient && form.specialite && form.id_medecin && form.date_heure;

  return (
    <section className="card">
      <h2>Prendre rendez-vous</h2>
      <p>Sélectionnez une spécialité, un médecin et un créneau horaire.</p>

      {initError && <p className="status status--error">{initError}</p>}

      {success && (
        <div className="status status--ok booking-success">
          <strong>Rendez-vous confirmé !</strong>
          <span>
            RDV #{success.id_rdv} — {new Date(success.date_heure).toLocaleString('fr-FR')} — Statut :{' '}
            {success.statut}
          </span>
          <Link to="/mes-rendez-vous" className="booking-success-link">
            Consulter mes rendez-vous
          </Link>
        </div>
      )}

      {error && <p className="status status--error">{error}</p>}

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_patient">Patient</label>
          <select
            id="id_patient"
            name="id_patient"
            className="form-select"
            value={form.id_patient}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">— Sélectionner —</option>
            {patients.map((p) => (
              <option key={p.id_utilisateur} value={p.id_utilisateur}>
                {p.prenom} {p.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="specialite">Spécialité</label>
          <select
            id="specialite"
            name="specialite"
            className="form-select"
            value={form.specialite}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">— Sélectionner —</option>
            {specialites.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="id_medecin">Médecin</label>
          <select
            id="id_medecin"
            name="id_medecin"
            className="form-select"
            value={form.id_medecin}
            onChange={handleChange}
            required
            disabled={loading || !form.specialite}
          >
            <option value="">— Sélectionner —</option>
            {medecins.map((m) => (
              <option key={m.id_utilisateur} value={m.id_utilisateur}>
                Dr {m.prenom} {m.nom} — {m.specialite}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date_heure">Date et heure</label>
          <input
            id="date_heure"
            name="date_heure"
            type="datetime-local"
            className="form-input"
            value={form.date_heure}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="motif">Motif (optionnel)</label>
          <input
            id="motif"
            name="motif"
            type="text"
            className="form-input"
            value={form.motif}
            onChange={handleChange}
            placeholder="Consultation de contrôle"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" aria-hidden="true" />
              Traitement de votre réservation en cours...
            </span>
          ) : (
            'Confirmer le rendez-vous'
          )}
        </button>
      </form>
    </section>
  );
}
