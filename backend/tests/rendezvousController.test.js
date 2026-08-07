const test = require('node:test');
const assert = require('node:assert');

const db = require('../src/config/db');
const { listPatientAppointments } = require('../src/controllers/rendezvousController');

// Stub minimal de la réponse Express (chaînage status().json()).
function makeRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

// Fake next : capture l'erreur passée par le contrôleur.
function makeNext() {
  const next = (err) => {
    next.lastError = err;
  };
  next.lastError = undefined;
  return next;
}

// Construit un objet `req` réaliste.
function makeReq({ id = '1', filter = 'all', user = { role: 'PATIENT', id: 1 } } = {}) {
  return { params: { id }, query: { filter }, user };
}

// Simule `db.query` (comptage vs lignes) et capture tous les appels.
function mockDbQuery(t, rows, calls) {
  t.mock.method(db, 'query', async (sql, params) => {
    calls.push({ sql, params });
    if (String(sql).includes('COUNT(*)')) {
      return { rows: [{ total: String(rows.length) }] };
    }
    return { rows };
  });
}

const SAMPLE_ROWS = [
  {
    id_rdv: 1,
    date_heure: '2026-06-20T10:00:00',
    motif: 'Contrôle',
    statut: 'PLANIFIE',
    medecin_nom: 'Martin',
    medecin_prenom: 'Jean',
    specialite: 'Cardiologie',
  },
];

test('patient connecté : renvoie ses rendez-vous (200 + body)', async (t) => {
  const calls = [];
  mockDbQuery(t, SAMPLE_ROWS, calls);
  const res = makeRes();
  const next = makeNext();

  await listPatientAppointments(makeReq({ id: '1' }), res, next);

  assert.strictEqual(next.lastError, undefined);
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, SAMPLE_ROWS);
  assert.strictEqual(res.body.pagination.totalItems, SAMPLE_ROWS.length);
  assert.strictEqual(res.body.pagination.currentPage, 1);
  assert.ok(calls.length >= 2); // count + requête principale
});

test('patient connecté : la requête est filtrée sur son identifiant', async (t) => {
  const calls = [];
  mockDbQuery(t, SAMPLE_ROWS, calls);
  await listPatientAppointments(makeReq({ id: '1' }), makeRes(), makeNext());
  const main = calls.find((c) => !c.sql.includes('COUNT(*)'));
  assert.strictEqual(main.params[0], 1);
});

test("accès refusé : un patient ne peut pas consulter le RDV d'un autre (403)", async (t) => {
  const calls = [];
  mockDbQuery(t, SAMPLE_ROWS, calls);
  const res = makeRes();
  const next = makeNext();

  await listPatientAppointments(makeReq({ id: '2', user: { role: 'PATIENT', id: 1 } }), res, next);

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.lastError.status, 403);
  assert.strictEqual(calls.length, 0); // aucun accès BDD pour un accès interdit
});

test('mauvais identifiant (non numérique) : 400', async (t) => {
  const res = makeRes();
  const next = makeNext();
  await listPatientAppointments(makeReq({ id: 'abc' }), res, next);
  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.lastError.status, 400);
});

test('aucun rendez-vous : 200 avec liste vide et pagination à zéro', async (t) => {
  mockDbQuery(t, [], []);
  const res = makeRes();
  await listPatientAppointments(makeReq({ id: '1' }), res, makeNext());
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body.data, []);
  assert.strictEqual(res.body.pagination.totalItems, 0);
  assert.strictEqual(res.body.pagination.totalPages, 0);
});

test('plusieurs rendez-vous : tous renvoyés', async (t) => {
  const multiple = [SAMPLE_ROWS[0], { ...SAMPLE_ROWS[0], id_rdv: 2 }];
  mockDbQuery(t, multiple, []);
  const res = makeRes();
  await listPatientAppointments(makeReq({ id: '1' }), res, makeNext());
  assert.strictEqual(res.body.data.length, 2);
});

test('filtre "upcoming" : condition date_heure >= NOW()', async (t) => {
  const calls = [];
  mockDbQuery(t, SAMPLE_ROWS, calls);
  await listPatientAppointments(makeReq({ id: '1', filter: 'upcoming' }), makeRes(), makeNext());
  const main = calls.find((c) => !c.sql.includes('COUNT(*)'));
  assert.match(main.sql, /date_heure >= NOW\(\)/);
});

test('filtre "past" : condition date_heure < NOW()', async (t) => {
  const calls = [];
  mockDbQuery(t, SAMPLE_ROWS, calls);
  await listPatientAppointments(makeReq({ id: '1', filter: 'past' }), makeRes(), makeNext());
  const main = calls.find((c) => !c.sql.includes('COUNT(*)'));
  assert.match(main.sql, /date_heure < NOW\(\)/);
});

test('sans filtre (all) : aucune condition temporelle', async (t) => {
  const calls = [];
  mockDbQuery(t, SAMPLE_ROWS, calls);
  await listPatientAppointments(makeReq({ id: '1', filter: 'all' }), makeRes(), makeNext());
  const main = calls.find((c) => !c.sql.includes('COUNT(*)'));
  assert.doesNotMatch(main.sql, /date_heure [<>]= NOW\(\)/);
});

test("erreur serveur : l'erreur est propagée à next()", async (t) => {
  const boom = new Error('connexion perdue');
  t.mock.method(db, 'query', async () => {
    throw boom;
  });
  const res = makeRes();
  const next = makeNext();
  await listPatientAppointments(makeReq(), res, next);
  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.lastError, boom);
});