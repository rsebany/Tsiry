import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { getPatientsPresent, generateTicket } from '@/services/ticketService';
import { errorMessage } from '@/services/api';

const ticketSchema = z.object({
  patient_nom: z.string().trim().min(2, 'Mila anarana (2 litera farafahakeliny)'),
  patient_prenom: z.string().trim().min(2, 'Mila fanampin\'anarana (2 litera farafahakeliny)'),
  id_patient: z.coerce.number().int().positive().nullish(),
});

// ============ OWNER: Jess (UC3 + UC4 - distribution de ticket) ============
// Le composant TicketGenerator consomme ce hook (aucune logique dupliquée).
export default function useTicketGenerator() {
  const [patientsPresent, setPatientsPresent] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [link, setLink] = useState({ id_rdv: null, enabled: true });

  const form = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: { patient_nom: '', patient_prenom: '', id_patient: null },
  });

  const watchNom = form.watch('patient_nom');
  const watchPrenom = form.watch('patient_prenom');

  const selectedRdv = link.id_rdv ? String(link.id_rdv) : '';
  const manualEntry = !link.id_rdv && (watchNom || watchPrenom);

  useEffect(() => {
    let mounted = true;
    getPatientsPresent()
      .then((list) => {
        if (mounted) setPatientsPresent(list || []);
      })
      .catch(() => {
        if (mounted) setPatientsPresent([]);
      })
      .finally(() => {
        if (mounted) setLoadingPatients(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function handleSelectPresent(idRdv) {
    if (!idRdv) {
      form.setValue('id_patient', null);
      setLink({ id_rdv: null, enabled: true });
      return;
    }
    const found = patientsPresent.find((p) => String(p.id_rdv) === String(idRdv));
    if (found) {
      form.setValue('patient_nom', found.patient_nom || '');
      form.setValue('patient_prenom', found.patient_prenom || '');
      form.setValue('id_patient', found.id_patient || null);
      setLink({ id_rdv: found.id_rdv, enabled: true });
    }
  }

  function handleManualChange() {
    if (link.id_rdv) {
      form.setValue('id_patient', null);
      setLink({ id_rdv: null, enabled: false });
    }
  }

  async function submit(values, onGenerated) {
    setSubmitting(true);
    setTicket(null);
    try {
      const res = await generateTicket(values);
      if (res.success) {
        toast.success(`Tiketo #${res.data.numero} noforonina`);
        setTicket(res.data);
        form.reset({ patient_nom: '', patient_prenom: '', id_patient: null });
        setLink({ id_rdv: null, enabled: true });
        onGenerated?.(res.data);
      } else {
        toast.error(res.message || 'Tsy afaka mamorona');
      }
    } catch (err) {
      toast.error(errorMessage(err, 'Tsy afaka mamorona tiketo'));
    } finally {
      setSubmitting(false);
    }
  }

  function closeTicket() {
    setTicket(null);
  }

  return {
    form,
    patientsPresent,
    loadingPatients,
    submitting,
    ticket,
    link,
    selectedRdv,
    manualEntry,
    handleSelectPresent,
    handleManualChange,
    submit,
    closeTicket,
  };
}
