import { useState } from 'react';

export default function KiosquePanel({
  idRdv,
  loading,
  error,
  success,
  onIdChange,
  onSubmit,
  searchNom,
  onSearchNomChange,
  searchTelephone,
  onSearchTelephoneChange,
  results,
  searching,
  searchError,
  searched,
  onSearch,
  onSelectRdv,
  onResetSearch,
}) {
  const [mode, setMode] = useState('numero');

  if (success) {
    return (
      <div className="kiosque-panel kiosque-panel--success">
        <h1>Enregistrement réussi</h1>
        {success.patient_prenom && success.patient_nom && (
          <p className="kiosque-detail">
            {success.patient_prenom} {success.patient_nom}
          </p>
        )}
        <p>Votre présence est signalée. Veuillez vous installer en salle d&apos;attente.</p>
        <p className="kiosque-detail">
          RDV #{success.id_rdv}
          {success.date_heure &&
            ` — ${new Date(success.date_heure).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}`}
          {success.statut ? ` — Statut : ${success.statut}` : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="kiosque-panel">
      <h1>Borne d&apos;accueil</h1>

      <div className="kiosque-tabs">
        <button
          type="button"
          className={`kiosque-tab ${mode === 'numero' ? 'kiosque-tab--active' : ''}`}
          onClick={() => {
            setMode('numero');
            onResetSearch();
          }}
        >
          N° de rendez-vous
        </button>
        <button
          type="button"
          className={`kiosque-tab ${mode === 'recherche' ? 'kiosque-tab--active' : ''}`}
          onClick={() => setMode('recherche')}
        >
          Rechercher par nom
        </button>
      </div>

      {error && <p className="kiosque-error">{error}</p>}

      {mode === 'numero' ? (
        <form onSubmit={onSubmit} className="kiosque-form">
          <input
            type="number"
            inputMode="numeric"
            className="kiosque-input"
            value={idRdv}
            onChange={(e) => onIdChange(e.target.value)}
            placeholder="N° rendez-vous"
            required
            disabled={loading}
            autoFocus
          />
          <button type="submit" className="kiosque-btn" disabled={loading || !idRdv}>
            {loading ? 'Vérification…' : 'Confirmer ma présence'}
          </button>
        </form>
      ) : (
        <form onSubmit={onSearch} className="kiosque-form">
          <input
            type="text"
            className="kiosque-input"
            value={searchNom}
            onChange={(e) => onSearchNomChange(e.target.value)}
            placeholder="Nom ou prénom du patient"
            disabled={searching}
          />
          <input
            type="tel"
            className="kiosque-input"
            value={searchTelephone}
            onChange={(e) => onSearchTelephoneChange(e.target.value)}
            placeholder="Téléphone (optionnel)"
            disabled={searching}
          />
          <button type="submit" className="kiosque-btn" disabled={searching}>
            {searching ? 'Recherche…' : 'Rechercher'}
          </button>

          {searchError && <p className="kiosque-error">{searchError}</p>}

          {searched && results.length === 0 && (
            <p className="kiosque-hint">
              Aucun rendez-vous trouvé aujourd&apos;hui. Vérifiez le nom ou le téléphone, ou
              dirigez-vous vers le guichet.
            </p>
          )}

          {results.length > 0 && (
            <ul className="kiosque-results">
              {results.map((rdv) => (
                <li key={rdv.id_rdv}>
                  <button
                    type="button"
                    className="kiosque-result"
                    disabled={loading}
                    onClick={() => onSelectRdv(rdv.id_rdv)}
                  >
                    <span className="kiosque-result-name">
                      {rdv.patient_prenom} {rdv.patient_nom}
                    </span>
                    <span className="kiosque-result-time">
                      {new Date(rdv.date_heure).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="kiosque-result-action">S&apos;enregistrer →</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      )}
    </div>
  );
}
