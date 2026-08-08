const { test } = require('node:test');
const assert = require('node:assert/strict');
const { evaluateTimeWindow, AVANCE_MAX_MIN, RETARD_MAX_MIN } = require('./timeWindow');

const NOW = new Date('2026-08-07T10:00:00');

function rdvAt(minutesOffset) {
  return new Date(NOW.getTime() + minutesOffset * 60000);
}

test('accepte un RDV aujourd’hui dans la fenêtre [−15 min, +30 min]', () => {
  for (const minutes of [-15, 0, 30]) {
    const res = evaluateTimeWindow(rdvAt(minutes), NOW);
    assert.equal(res.ok, true, `diffMin=${minutes} devrait être accepté`);
    assert.equal(res.code, 'OK');
  }
});

test('refuse un RDV en avance de plus de 30 min (TOO_EARLY)', () => {
  const res = evaluateTimeWindow(rdvAt(31), NOW);
  assert.equal(res.ok, false);
  assert.equal(res.code, 'TOO_EARLY');
  assert.equal(res.message, `Enregistrement trop tôt. Veuillez revenir 1 min avant l'heure prévue.`);
});

test('TOO_EARLY indique le bon nombre de minutes restantes', () => {
  const res = evaluateTimeWindow(rdvAt(61), NOW);
  assert.equal(res.code, 'TOO_EARLY');
  assert.equal(res.message, `Enregistrement trop tôt. Veuillez revenir 31 min avant l'heure prévue.`);
});

test('refuse un RDV passé de plus de 15 min (TOO_LATE)', () => {
  const res = evaluateTimeWindow(rdvAt(-16), NOW);
  assert.equal(res.ok, false);
  assert.equal(res.code, 'TOO_LATE');
  assert.equal(res.message, 'Enregistrement refusé : délai de présentation dépassé. Dirigez-vous vers le guichet.');
});

test('refuse un RDV prévu un autre jour (WRONG_DAY)', () => {
  const hier = new Date('2026-08-06T10:00:00');
  const demain = new Date('2026-08-08T10:00:00');
  for (const date of [hier, demain]) {
    const res = evaluateTimeWindow(date, NOW);
    assert.equal(res.ok, false);
    assert.equal(res.code, 'WRONG_DAY');
  }
});

test('cas limites exacts : +30 ok, −15 ok, +30.5 refus, −15.5 refus', () => {
  assert.equal(evaluateTimeWindow(rdvAt(30), NOW).ok, true);
  assert.equal(evaluateTimeWindow(rdvAt(-15), NOW).ok, true);
  assert.equal(evaluateTimeWindow(rdvAt(30.5), NOW).code, 'TOO_EARLY');
  assert.equal(evaluateTimeWindow(rdvAt(-15.5), NOW).code, 'TOO_LATE');
});

test('constantes exportées pour la fenêtre', () => {
  assert.equal(AVANCE_MAX_MIN, 30);
  assert.equal(RETARD_MAX_MIN, 15);
});
