const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { start, stop, api } = require('../helpers/server');
const db = require('../helpers/db');

let agentToken;
let patientToken;
let ticketId;

before(async () => {
  await start();
  const login = async (email) => {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email, password: 'demo123' },
    });
    assert.equal(res.status, 200, 'login attendu OK');
    return res.json.token;
  };
  agentToken = await login('agent.accueil@demo.fr');
  patientToken = await login('marie.dupont@demo.fr');
});

after(async () => {
  await stop();
  await db.close();
});

test('UC4: création de ticket par l\'agent (EN_ATTENTE)', async () => {
  const res = await api('/tickets/generate', {
    method: 'POST',
    token: agentToken,
    body: { patient_nom: 'Rasoa', patient_prenom: 'Fara' },
  });
  assert.equal(res.status, 201);
  assert.equal(res.json.success, true);
  assert.ok(res.json.data.id_ticket);
  assert.ok(res.json.data.numero >= 1);
  assert.equal(res.json.data.statut, 'EN_ATTENTE');
  ticketId = res.json.data.id_ticket;
});

test('UC4: récupération de la file d\'attente', async () => {
  const res = await api('/file-attente', { token: agentToken });
  assert.equal(res.status, 200);
  assert.equal(res.json.success, true);
  assert.ok(res.json.data.file_attente.id_file);
  assert.ok(Array.isArray(res.json.data.tickets));
  assert.ok(res.json.data.total_en_attente >= 1);
});

test('UC4: patients présents listés (dépendance UC3)', async () => {
  const res = await api('/patients/present', { token: agentToken });
  assert.equal(res.status, 200);
  const marie = res.json.data.find((p) => p.id_patient === 1);
  assert.ok(marie, 'la patiente présente devrait être listée');
  assert.equal(marie.patient_nom, 'Dupont');
});

test('UC4: appel du ticket (EN_ATTENTE -> EN_COURS)', async () => {
  const res = await api(`/tickets/${ticketId}/call`, { method: 'PATCH', token: agentToken });
  assert.equal(res.status, 200);
  assert.equal(res.json.data.statut, 'EN_COURS');
});

test('UC4: double appel refusé (409)', async () => {
  const res = await api(`/tickets/${ticketId}/call`, { method: 'PATCH', token: agentToken });
  assert.equal(res.status, 409);
});

test('UC4: clôture du ticket (EN_COURS -> TRAITE)', async () => {
  const res = await api(`/tickets/${ticketId}/close`, { method: 'PATCH', token: agentToken });
  assert.equal(res.status, 200);
  assert.equal(res.json.data.statut, 'TRAITE');
});

test('UC4: clôture d\'un ticket déjà traité refusée (409)', async () => {
  const res = await api(`/tickets/${ticketId}/close`, { method: 'PATCH', token: agentToken });
  assert.equal(res.status, 409);
});

test('UC4: appel d\'un ticket inexistant (404)', async () => {
  const res = await api('/tickets/999999/call', { method: 'PATCH', token: agentToken });
  assert.equal(res.status, 404);
});

test('UC5: stats journalières de la file', async () => {
  const res = await api('/file-attente/stats', { token: agentToken });
  assert.equal(res.status, 200);
  assert.equal(res.json.success, true);
  const data = res.json.data;
  assert.ok(data.file_attente.id_file);
  assert.ok(data.total_tickets >= 3);
  assert.ok(typeof data.par_statut === 'object');
  assert.ok(Array.isArray(data.par_heure));
  assert.equal(typeof data.temps_attente_moyen_min, 'number');
  assert.equal(typeof data.temps_service_moyen_min, 'number');
});

test('UC5: routes legacy PUT toujours opérationnelles', async () => {
  const created = await api('/tickets/generate', {
    method: 'POST',
    token: agentToken,
    body: { patient_nom: 'Legacy', patient_prenom: 'Test' },
  });
  assert.equal(created.status, 201);
  const legacyId = created.json.data.id_ticket;

  const appel = await api('/tickets/appeler', { method: 'PUT', token: agentToken });
  assert.equal(appel.status, 200);
  assert.equal(appel.json.data.statut, 'APPELE');

  const termin = await api(`/tickets/${legacyId}/terminer`, { method: 'PUT', token: agentToken });
  assert.equal(termin.status, 200);
  assert.equal(termin.json.data.statut, 'CLOTURE');
});

test('UC4: requête sans authentification (401)', async () => {
  const res = await api('/file-attente');
  assert.equal(res.status, 401);
});

test('UC4: un patient ne peut pas créer de ticket (403)', async () => {
  const res = await api('/tickets/generate', {
    method: 'POST',
    token: patientToken,
    body: { patient_nom: 'Interdit', patient_prenom: 'Role' },
  });
  assert.equal(res.status, 403);
});
