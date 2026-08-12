import { z } from 'zod';
import { SLOT } from '@/lib/constants';

// ============ OWNER: Nathan (UC1/UC2 - réservation RDV) ============
// // TODO Nathan: ajouter la règle "pas de RDV si déjà réservé" côté client (backend renvoie 409).

export const rdvSchema = z
  .object({
    id_medecin: z.coerce.number().min(1, 'Mifidy dokotera azafady'),
    date_heure: z.string().min(1, 'Ilaina ny daty sy ora'),
    motif: z.string().max(255).optional(),
  })
  .superRefine((val, ctx) => {
    const date = new Date(val.date_heure);
    if (Number.isNaN(date.getTime())) return;

    if (date <= new Date()) {
      ctx.addIssue({
        code: 'custom',
        path: ['date_heure'],
        message: 'Tsy afaka misoratra fotoana efa lasa.',
      });
    }
    if (date.getDay() === SLOT.CLOSED_DAY) {
      ctx.addIssue({
        code: 'custom',
        path: ['date_heure'],
        message: 'Tsy misy fotoana ny Alahady.',
      });
    }
    const heure = date.getHours();
    if (heure < SLOT.HOURS_START || heure >= SLOT.HOURS_END) {
      ctx.addIssue({
        code: 'custom',
        path: ['date_heure'],
        message: `Fotoana misy hatramin'ny ${SLOT.HOURS_START} ora ka hatramin'ny ${SLOT.HOURS_END} ora.`,
      });
    }
  });

// Le champ datetime-local interdit les dates passées (min dynamique).
export function minDatetime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}
