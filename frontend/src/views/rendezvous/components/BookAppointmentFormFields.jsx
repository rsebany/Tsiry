import FormField from '../../../components/ui/FormField.jsx';

export default function BookAppointmentFormFields({
  form,
  specialites,
  medecins,
  patients,
  loading,
  isFormValid,
  handleChange,
  handleSubmit,
}) {
  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <FormField
        label="Patient"
        htmlFor="id_patient"
        name="id_patient"
        type="select"
        value={form.id_patient}
        onChange={handleChange}
        required
        disabled={loading}
        options={[
          { value: '', label: '— Sélectionner —' },
          ...patients.map((p) => ({
            value: String(p.id_utilisateur),
            label: `${p.prenom} ${p.nom}`,
          })),
        ]}
      />

      <FormField
        label="Spécialité"
        htmlFor="specialite"
        name="specialite"
        type="select"
        value={form.specialite}
        onChange={handleChange}
        required
        disabled={loading}
        options={[
          { value: '', label: '— Sélectionner —' },
          ...specialites.map((s) => ({ value: s, label: s })),
        ]}
      />

      <FormField
        label="Médecin"
        htmlFor="id_medecin"
        name="id_medecin"
        type="select"
        value={form.id_medecin}
        onChange={handleChange}
        required
        disabled={loading || !form.specialite}
        options={[
          { value: '', label: '— Sélectionner —' },
          ...medecins.map((m) => ({
            value: String(m.id_utilisateur),
            label: `Dr ${m.prenom} ${m.nom} — ${m.specialite}`,
          })),
        ]}
      />

      <FormField
        label="Date et heure"
        htmlFor="date_heure"
        name="date_heure"
        type="datetime-local"
        value={form.date_heure}
        onChange={handleChange}
        required
        disabled={loading}
        min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)}
        hint="Disponible du lundi au samedi, entre 8h et 18h."
      />

      <FormField
        label="Motif (optionnel)"
        htmlFor="motif"
        name="motif"
        value={form.motif}
        onChange={handleChange}
        placeholder="Consultation de contrôle"
        disabled={loading}
      />

      <button type="submit" className="btn-primary" disabled={loading || !isFormValid}>
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
  );
}
