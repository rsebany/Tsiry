export default function Layout({ children }) {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Système de Gestion Hospitalière</h1>
        <p className="app-subtitle">Interface graphique</p>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
