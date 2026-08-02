import { z } from 'zod';
import { SLOT } from '@/lib/constants';

// ============ OWNER: Nathan (UC1/UC2 - réservation RDV) ============
// // TODO Nathan: ajouter la règle "pas de RDV si déjà réservé" côté client (backend renvoie 409).

export const rdvSchema = z
  .object({
    id_medecin: z.coerce.number().min(1, 'Veuillez choisir un médecin'),
    date_heure: z.string().min(1, 'Date et heure requises'),
    motif: z.string().max(255).optional(),
  })
  .superRefine((val, ctx) => {
    const date = new Date(val.date_heure);
    if (Number.isNaN(date.getTime())) return;

    if (date <= new Date()) {
      ctx.addIssue({
        code: 'custom',
        path: ['date_heure'],
        message: 'Impossible de réserver un rendez-vous dans le passé.',
      });
    }
    if (date.getDay() === SLOT.CLOSED_DAY) {
      ctx.addIssue({
        code: 'custom',
        path: ['date_heure'],
        message: 'Aucun rendez-vous le dimanche.',
      });
    }
    const heure = date.getHours();
    if (heure < SLOT.HOURS_START || heure >= SLOT.HOURS_END) {
      ctx.addIssue({
        code: 'custom',
        path: ['date_heure'],
        message: `Créneaux disponibles uniquement entre ${SLOT.HOURS_START}h et ${SLOT.HOURS_END}h.`,
      });
    }
  });

// Le champ datetime-local interdit les dates passées (min dynamique).
export function minDatetime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}
