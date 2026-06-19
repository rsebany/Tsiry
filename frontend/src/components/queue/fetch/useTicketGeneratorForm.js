import { useState } from 'react';
import toast from 'react-hot-toast';
import { generateTicket } from '../../../services/ticketService.js';

export default function useTicketGeneratorForm(onTicketGenerated, patientsPresent) {
  const [patient, setPatient] = useState({ patient_nom: '', patient_prenom: '', id_patient: null });
  const [selectedPresent, setSelectedPresent] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSelectPresent(e) {
    const value = e.target.value;
    setSelectedPresent(value);
    if (!value) {
      setPatient({ patient_nom: '', patient_prenom: '', id_patient: null });
      return;
    }
    const found = patientsPresent.find((p) => String(p.id_rdv) === value);
    if (found) {
      setPatient({
        patient_nom: found.patient_nom,
        patient_prenom: found.patient_prenom,
        id_patient: found.id_patient || null,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!patient.patient_nom || !patient.patient_prenom) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await generateTicket(patient);
      if (response.success) {
        toast.success(`Ticket #${response.data.numero} créé`);
        setPatient({ patient_nom: '', patient_prenom: '', id_patient: null });
        setSelectedPresent('');
        onTicketGenerated(response.data);
      } else {
        toast.error(response.message || 'Erreur lors de la création');
      }
    } catch {
      toast.error('Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  }

  return {
    patient,
    setPatient,
    selectedPresent,
    loading,
    handleSelectPresent,
    handleSubmit,
  };
}
