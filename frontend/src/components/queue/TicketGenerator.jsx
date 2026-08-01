import LegacyCard from '../ui/LegacyCard.jsx';
import FormField from '../ui/FormField.jsx';
import usePatientsPresentFetch from './fetch/usePatientsPresentFetch.js';
import useTicketGeneratorForm from './fetch/useTicketGeneratorForm.js';

export default function TicketGenerator({ onTicketGenerated }) {
  const { patientsPresent } = usePatientsPresentFetch();
  const {
    patient,
    setPatient,
    selectedPresent,
    loading,
    handleSelectPresent,
    handleManualChange,
    handleSubmit,
  } = useTicketGeneratorForm(onTicketGenerated, patientsPresent);

  const manualEntry = !selectedPresent && (patient.patient_nom || patient.patient_prenom);

  return (
    <LegacyCard
      title="Distribuer un ticket"
      description="Enregistrez un patient présent sur site ou saisissez manuellement."
    >
      {patientsPresent.length > 0 && (
        <FormField
          label="Patients présents (UC3)"
          htmlFor="present_select"
          type="select"
          value={selectedPresent}
          onChange={handleSelectPresent}
          disabled={loading}
          options={[
            { value: '', label: '— Sélectionner un patient présent —' },
            ...patientsPresent.map((p) => ({
              value: String(p.id_rdv),
              label: `${p.patient_prenom} ${p.patient_nom} (RDV #${p.id_rdv})`,
            })),
          ]}
        />
      )}

      {manualEntry && (
        <p className="form-hint ticket-warning">
          Patient saisi manuellement : le ticket ne sera pas lié à un patient enregistré — la
          priorité urgence (UC8) ne pourra pas s&apos;appliquer. Sélectionnez le patient présent
          si possible.
        </p>
      )}

      <form className="booking-form" onSubmit={handleSubmit}>
        <FormField
          label="Nom du patient"
          htmlFor="patient_nom"
          name="patient_nom"
          value={patient.patient_nom}
          onChange={(e) => handleManualChange('patient_nom', e.target.value)}
          required
          disabled={loading}
        />
        <FormField
          label="Prénom du patient"
          htmlFor="patient_prenom"
          name="patient_prenom"
          value={patient.patient_prenom}
          onChange={(e) => handleManualChange('patient_prenom', e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Génération en cours…' : 'Distribuer un ticket'}
        </button>
      </form>
    </LegacyCard>
  );
}
