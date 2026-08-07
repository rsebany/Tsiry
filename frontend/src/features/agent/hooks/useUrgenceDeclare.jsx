import { useEffect, useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { AlertTriangle, CheckCircle2, Siren } from 'lucide-react';
import { declarerUrgence } from '@/services/urgenceService';
import { fetchMedecins } from '@/services/rendezvousService';
import { errorMessage } from '@/services/api';

// ============ OWNER: Jess / Nathan (triage par ticket) ============
// Le formulaire n'envoie JAMAIS l'identité du patient : uniquement le
// ticket + constantes. Le patient est résolu automatiquement côté serveur.

export const triageSchema = z.object({
  id_ticket: z.coerce.number().int().positive('Numéro de ticket invalide'),
  id_medecin: z.coerce.number().int().positive().nullish(),
  pouls: z.coerce.number().int().min(30).max(200, 'Pouls hors limites (30–200)'),
  tension_systolique: z.coerce.number().int().min(60).max(250, 'Tension hors limites (60–250)'),
  saturation_o2: z.coerce.number().int().min(70).max(100, 'SpO₂ hors limites (70–100)'),
});

const PRIORITY_TONE = {
  ROUGE: {
    border: 'border-red-300 bg-red-50/90 text-red-800',
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    title: (p) => `Alerte ${p} — urgence prioritaire`,
  },
  ORANGE: {
    border: 'border-amber-300 bg-amber-50/90 text-amber-800',
    icon: <Siren className="h-5 w-5 text-amber-600" />,
    title: (p) => `Alerte ${p} — surveillance rapprochée`,
  },
  VERT: {
    border: 'border-emerald-300 bg-emerald-50/90 text-emerald-800',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    title: () => 'Cas enregistré',
  },
};

export default function useUrgenceDeclare() {
  const [medecins, setMedecins] = useState([]);
  const [loadingMedecins, setLoadingMedecins] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchMedecins()
      .then((data) => {
        if (mounted && Array.isArray(data)) setMedecins(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoadingMedecins(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function showTriageToast(data) {
    const tone = PRIORITY_TONE[data.niveau_priorite] || PRIORITY_TONE.VERT;
    const pos = data.position_file ? `#${data.position_file}` : 'En consultation';
    toast.custom(
      () => (
        <div className={`flex w-80 items-start gap-3 rounded-2xl border ${tone.border} p-3.5 shadow-xl backdrop-blur`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80">
            {tone.icon}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold leading-tight">{tone.title(data.niveau_priorite)}</p>
            <p className="mt-0.5 text-xs opacity-90">
              Ticket {data.numero_ticket ? `#${data.numero_ticket}` : ''} — Position en file : <strong>{pos}</strong>
            </p>
          </div>
        </div>
      ),
      { duration: 5500, position: 'top-right' }
    );
  }

  async function submit(payload) {
    const data = {
      id_ticket: Number(payload.id_ticket),
      pouls: Number(payload.pouls),
      tension_systolique: Number(payload.tension_systolique),
      saturation_o2: Number(payload.saturation_o2),
    };
    if (payload.id_medecin) data.id_medecin = Number(payload.id_medecin);

    setLoading(true);
    setResult(null);
    try {
      const res = await declarerUrgence(data);
      setResult(res.data);
      showTriageToast(res.data);
      return { success: true };
    } catch (err) {
      const msg = errorMessage(err, 'Erreur lors de la déclaration');
      toast.error(msg, { duration: 5000 });
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  return { medecins, loadingMedecins, result, loading, submit, clearResult: () => setResult(null) };
}