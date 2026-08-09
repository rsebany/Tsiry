const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { start, stop, api } = require('../helpers/server');
const db = require('../helpers/db');

let baseUrl;
let agentToken;
let medecinToken;
let patientToken;
let statusTicketId;

before(async () => {
  ({ baseUrl } = await start());
  const login = async (email) => {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email, password: 'demo123' },
    });
    assert.equal(res.status, 200, 'login attendu OK');
    return res.json.token;
  };
  agentToken = await login('agent.accueil@demo.fr');
  medecinToken = await login('jean.martin@demo.fr');
  patientToken = await login('marie.dupont@demo.fr');
});

after(async () => {
  await stop();
  await db.close();
});

async function genererTicket(body) {
  const res = await api('/tickets/generate', { method: 'POST', token: agentToken, body });
  assert.equal(res.status, 201);
  return res.json.data;
}

test('UC6: statut d\'un ticket en attente', async () => {
  const ticket = await genererTicket({
    patient_nom: 'UC6',
    patient_prenom: 'Statut',
    id_patient: 1,
  });
  statusTicketId = ticket.id_ticket;

  const res = await api(`/tickets/${statusTicketId}/status`, { token: patientToken });
  assert.equal(res.status, 200);
  assert.ok(res.json.data.numero);
  assert.equal(res.json.data.statut, 'EN_ATTENTE');
  assert.ok('personnes_avant' in res.json.data);
  assert.ok('estimation_minutes' in res.json.data);
  assert.ok('message' in res.json.data);
  assert.ok('numero_box' in res.json.data);
  assert.ok('niveau_priorite' in res.json.data);
});

test('UC6: niveau_priorite remonté dans le statut (dépendance UC8)', async () => {
  await db.query(
    `INSERT INTO t_cas_urgence
       (id_patient, pouls, tension_systolique, saturation_o2, niveau_priorite, score_gravite)
     VALUES (1, 110, 90, 90, 'ROUGE', 100)`
  );
  const res = await api(`/tickets/${statusTicketId}/status`, { token: patientToken });
  assert.equal(res.status, 200);
  assert.equal(res.json.data.niveau_priorite, 'ROUGE');
});

test('UC6: appel en consultation avec box par le médecin', async () => {
  const ticket = await genererTicket({ patient_nom: 'UC6', patient_prenom: 'Box' });
  const res = await api(`/tickets/${ticket.id_ticket}/trigger-call`, {
    method: 'PATCH',
    token: medecinToken,
    body: { numero_box: 'B3' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.json.data.statut, 'EN_CONSULTATION');
  assert.equal(res.json.data.numero_box, 'B3');
});

test('UC6: trigger-call sans numero_box (400)', async () => {
  const ticket = await genererTicket({ patient_nom: 'UC6', patient_prenom: 'SansBox' });
  const res = await api(`/tickets/${ticket.id_ticket}/trigger-call`, {
    method: 'PATCH',
    token: medecinToken,
    body: {},
  });
  assert.equal(res.status, 400);
});

test('UC6: trigger-call sur ticket déjà appelé (409)', async () => {
  const ticket = await genererTicket({ patient_nom: 'UC6', patient_prenom: 'DejaAppele' });
  await api(`/tickets/${ticket.id_ticket}/trigger-call`, {
    method: 'PATCH',
    token: medecinToken,
    body: { numero_box: 'B1' },
  });
  const res = await api(`/tickets/${ticket.id_ticket}/trigger-call`, {
    method: 'PATCH',
    token: medecinToken,
    body: { numero_box: 'B2' },
  });
  assert.equal(res.status, 409);
});

test('UC6: statut d\'un ticket inexistant (404)', async () => {
  const res = await api('/tickets/999999/status', { token: patientToken });
  assert.equal(res.status, 404);
});

test('UC6: un patient ne peut pas consulter le statut d\'un autre patient (403)', async () => {
  const rows = await db.query(
    `INSERT INTO t_utilisateur (nom, prenom, email, password_hash, role_type)
     VALUES ('Autre', 'Patient', 'autre.patient@demo.fr',
             '$2b$10$4NNs3WDwZ/KeEDe84XlpJO4JFK3Ix7sTVc1me54o/4SGVkM2tAinG', 'PATIENT')
     RETURNING id_utilisateur`
  );
  const autrePatientId = rows[0].id_utilisateur;
  const ticket = await genererTicket({
    patient_nom: 'Autre',
    patient_prenom: 'Patient',
    id_patient: autrePatientId,
  });
  const res = await api(`/tickets/${ticket.id_ticket}/status`, { token: patientToken });
  assert.equal(res.status, 403);
});

test('UC6: flux SSE du statut ticket', async () => {
  const ticket = await genererTicket({
    patient_nom: 'UC6',
    patient_prenom: 'SSE',
    id_patient: 1,
  });

  const res = await fetch(
    `${baseUrl}/tickets/${ticket.id_ticket}/status/stream?token=${patientToken}`
  );
  assert.equal(res.status, 200);
  assert.ok(res.headers.get('content-type').startsWith('text/event-stream'));

  const reader = res.body.getReader();
  const { value } = await reader.read();
  const chunk = new TextDecoder().decode(value);
  assert.ok(chunk.includes('data:'));
  assert.ok(chunk.includes(`"id_ticket":${ticket.id_ticket}`));
  await reader.cancel();
});
