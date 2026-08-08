const AVANCE_MAX_MIN = 30;
const RETARD_MAX_MIN = 15;

/**
 * Règle métier UC3 — fenêtre d'enregistrement d'un rendez-vous.
 * - RDV du jour uniquement
 * - pas plus de 30 min d'avance (fenêtre standard)
 * - pas plus de 15 min de retard
 */
function evaluateTimeWindow(rdvDate, now) {
  if (rdvDate.toDateString() !== now.toDateString()) {
    return {
      ok: false,
      code: 'WRONG_DAY',
      message: "Enregistrement refusé : votre rendez-vous n'est pas prévu aujourd'hui.",
    };
  }

  const diffMin = (rdvDate.getTime() - now.getTime()) / 60000;

  if (diffMin > AVANCE_MAX_MIN) {
    return {
      ok: false,
      code: 'TOO_EARLY',
      message: `Enregistrement trop tôt. Veuillez revenir ${Math.ceil(diffMin - AVANCE_MAX_MIN)} min avant l'heure prévue.`,
    };
  }

  if (diffMin < -RETARD_MAX_MIN) {
    return {
      ok: false,
      code: 'TOO_LATE',
      message: 'Enregistrement refusé : délai de présentation dépassé. Dirigez-vous vers le guichet.',
    };
  }

  return { ok: true, code: 'OK' };
}

module.exports = { evaluateTimeWindow, AVANCE_MAX_MIN, RETARD_MAX_MIN };
