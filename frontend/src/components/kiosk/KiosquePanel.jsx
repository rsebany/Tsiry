export default function KiosquePanel({
  idRdv,
  loading,
  error,
  success,
  onIdChange,
  onSubmit,
}) {
  if (success) {
    return (
      <div className="kiosque-panel kiosque-panel--success">
        <h1>Enregistrement réussi</h1>
        <p>Votre présence est signalée. Veuillez vous installer en salle d&apos;attente.</p>
        <p className="kiosque-detail">
          RDV #{success.id_rdv} — Statut : {success.statut}
        </p>
      </div>
    );
  }

  return (
    <div className="kiosque-panel">
      <h1>Borne d&apos;accueil</h1>
      <p>Saisissez le numéro de votre rendez-vous</p>

      {error && <p className="kiosque-error">{error}</p>}

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
    </div>
  );
}
