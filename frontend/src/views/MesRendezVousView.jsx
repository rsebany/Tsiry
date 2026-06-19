import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPatientAppointments } from '../services/rendezvousService.js';
import { checkIsEmptyState, getBadgeColorByStatus } from '../services/rendezvousUtils.js';

const DEMO_PATIENT_ID = 1;

export default function MesRendezVousView() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchPatientAppointments(DEMO_PATIENT_ID)
      .then((data) => {
        if (!cancelled) setAppointments(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.error || "Impossible de charger l'historique des rendez-vous.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="card">
        <p className="status status--loading">Chargement de vos données médicales…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card">
        <p className="status status--error">{error}</p>
      </section>
    );
  }

  if (checkIsEmptyState(appointments)) {
    return (
      <section className="card">
        <h2>Mes rendez-vous</h2>
        <p>Vous n&apos;avez aucun rendez-vous planifié ou passé.</p>
        <p>
          <Link to="/prendre-rendez-vous">Prendre un nouveau rendez-vous</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Mes rendez-vous</h2>
      <p className="status-hint">Patient démo (id {DEMO_PATIENT_ID})</p>

      <div className="appointments-list">
        {appointments.map((rdv) => (
          <article key={rdv.id_rdv} className="appointment-card">
            <div className="appointment-card-header">
              <strong>
                {new Date(rdv.date_heure).toLocaleDateString('fr-FR')} à{' '}
                {new Date(rdv.date_heure).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
              <span
                className="appointment-badge"
                style={{ backgroundColor: getBadgeColorByStatus(rdv.statut) }}
              >
                {rdv.statut}
              </span>
            </div>
            <p>
              <strong>Médecin :</strong> Dr {rdv.prenom_medecin} {rdv.nom_medecin}
            </p>
            <p>
              <strong>Spécialité :</strong> {rdv.specialite}
            </p>
            <p>
              <strong>Motif :</strong> {rdv.motif || 'Non précisé'}
            </p>
          </article>
        ))}
      </div>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/prendre-rendez-vous">Prendre un nouveau rendez-vous</Link>
      </p>
    </section>
  );
}
