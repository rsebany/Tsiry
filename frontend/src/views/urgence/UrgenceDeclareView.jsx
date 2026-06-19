import LegacyCard from '../../components/ui/LegacyCard.jsx';
import FormField from '../../components/ui/FormField.jsx';
import UrgenceResultPanel from '../../components/urgence/UrgenceResultPanel.jsx';
import useUrgenceDeclareForm from './fetch/useUrgenceDeclareForm.js';

export default function UrgenceDeclareView() {
  const { form, medecins, result, loading, handleChange, handleSubmit } = useUrgenceDeclareForm();

  return (
    <LegacyCard
      title="Déclaration d'urgence"
      description="Saisie des constantes vitales pour triage automatique (UC7 / UC8 — Orneda)."
    >
      {result && <UrgenceResultPanel result={result} />}

      <form className="booking-form" onSubmit={handleSubmit}>
        <FormField
          label="ID patient"
          htmlFor="id_patient"
          name="id_patient"
          type="number"
          min={1}
          value={form.id_patient}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <FormField
          label="Médecin référent (optionnel)"
          htmlFor="id_medecin"
          name="id_medecin"
          type="select"
          value={form.id_medecin}
          onChange={handleChange}
          disabled={loading}
          options={[
            { value: '', label: '— Aucun —' },
            ...medecins.map((m) => ({
              value: String(m.id_utilisateur),
              label: `Dr ${m.prenom} ${m.nom}`,
            })),
          ]}
        />

        <FormField
          label="Pouls (bpm)"
          htmlFor="pouls"
          name="pouls"
          type="number"
          min={30}
          max={200}
          value={form.pouls}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <FormField
          label="Tension systolique (mmHg)"
          htmlFor="tension_systolique"
          name="tension_systolique"
          type="number"
          min={60}
          max={250}
          value={form.tension_systolique}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <FormField
          label="Saturation O₂ (%)"
          htmlFor="saturation_o2"
          name="saturation_o2"
          type="number"
          min={70}
          max={100}
          value={form.saturation_o2}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Analyse en cours…' : 'Déclarer le cas'}
        </button>
      </form>
    </LegacyCard>
  );
}
