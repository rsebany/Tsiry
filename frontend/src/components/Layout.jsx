import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Système de Gestion Hospitalière</h1>
        <p className="app-subtitle">Interface graphique</p>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Accueil
          </NavLink>
          <NavLink
            to="/prendre-rendez-vous"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            Prendre rendez-vous
          </NavLink>
          <NavLink
            to="/mes-rendez-vous"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            Mes rendez-vous
          </NavLink>
          <NavLink
            to="/file-attente"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            File d&apos;attente
          </NavLink>
          <NavLink
            to="/urgences/declare"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            Urgences
          </NavLink>
          <NavLink
            to="/medecin/appel"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            Appel médecin
          </NavLink>
          <NavLink
            to="/carte"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            Carte hôpitaux
          </NavLink>
          <NavLink
            to="/ticket/1/statut"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            Statut ticket
          </NavLink>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
