import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { declarerUrgence } from '@/services/urgenceService';
import { fetchMedecins } from '@/services/rendezvousService';
import { errorMessage } from '@/services/api';

const urgenceSchema = z.object({
  id_patient: z.coerce.number().int().positive('ID patient invalide'),
  id_medecin: z.coerce.number().int().positive().nullish(),
  pouls: z.coerce.number().int().min(30).max(200, 'Pouls hors limites (30–200)'),
  tension_systolique: z.coerce.number().int().min(60).max(250, 'Tension hors limites (60–250)'),
  saturation_o2: z.coerce.number().int().min(70).max(100, 'SpO₂ hors limites (70–100)'),
});

// ============ OWNER: Jess (UC1/UC8 - déclaration d'urgence) ============
// // TODO Jess: préremplir id_patient depuis le ticket sélectionné dans la file.
export default function useUrgenceDeclare() {
  const [medecins, setMedecins] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(urgenceSchema),
    defaultValues: {
      id_patient: 1,
      id_medecin: '',
      pouls: '',
      tension_systolique: '',
      saturation_o2: '',
    },
  });

  useEffect(() => {
    fetchMedecins()
      .then((data) => {
        if (Array.isArray(data)) setMedecins(data);
      })
      .catch(() => {});
  }, []);

  async function submit(values) {
    const payload = {
      id_patient: Number(values.id_patient),
      pouls: Number(values.pouls),
      tension_systolique: Number(values.tension_systolique),
      saturation_o2: Number(values.saturation_o2),
    };
    if (values.id_medecin) payload.id_medecin = Number(values.id_medecin);

    setLoading(true);
    setResult(null);
    try {
      const res = await declarerUrgence(payload);
      setResult(res.data);
      if (res.alerte) {
        toast.error(`Alerte ${res.data.niveau_priorite}`, { duration: 5000 });
      } else {
        toast.success('Cas enregistré');
      }
    } catch (err) {
      toast.error(errorMessage(err, 'Erreur lors de la déclaration'));
    } finally {
      setLoading(false);
    }
  }

  return { form, medecins, result, loading, submit };
}
