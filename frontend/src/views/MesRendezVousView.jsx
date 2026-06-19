import { Link } from 'react-router-dom';

export default function MesRendezVousView() {
  return (
    <section className="card">
      <h2>Mes rendez-vous</h2>
      <p className="status status--loading">
        UC2 — Consultation des rendez-vous (à implémenter par Nathan).
      </p>
      <p>
        <Link to="/prendre-rendez-vous">Prendre un nouveau rendez-vous</Link>
      </p>
    </section>
  );
}
