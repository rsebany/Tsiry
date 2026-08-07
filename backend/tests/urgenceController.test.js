const test = require('node:test');
const assert = require('node:assert');

const db = require('../src/config/db');
const { declarerUrgence } = require('../src/controllers/urgenceController');

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

// Requête réaliste : le client n'envoie JAMAIS id_patient.
function makeReq(body) {
  return { body };
}

// Ticket trouvé par Ticket.findById.
const TICKET = {
  id_ticket: 42,
  numero: 7,
  id_file: 1,
  id_patient: null,
  statut: 'EN_ATTENTE',
  patient_nom: 'Rakoto',
  patient_prenom: 'Jean',
};

// Cas retourné par CasUrgence.create.
function makeCas(niveau) {
  return {
    id_urgence: 1,
    id_patient: 1,
    id_medecin: null,
    pouls: 110,
    tension_systolique: 170,
    saturation_o2: 85,
    niveau_priorite: niveau,
    score_gravite: niveau === 'ROUGE' ? 4 : 1,
    date_declaration: '2026-08-07T08:00:00',
  };
}

// Route les appels db.query selon la commande SQL renvoyée.
function mockDbQuery(t, { ticket, cas, position = 1 }) {
  const calls = [];
  t.mock.method(db, 'query', async (sql, params) => {
    const s = String(sql).replace(/\s+/g, ' ');
    calls.push({ sql: s, params });
    if (s.includes('FROM t_ticket WHERE')) return { rows: ticket ? [ticket] : [] };
    if (s.includes('UPDATE t_ticket SET id_patient')) return { rows: [] };
    if (s.includes('INSERT INTO t_cas_urgence')) return { rows: [cas] };
    if (s.includes('SELECT rang FROM file_ordonnee')) {
      return { rows: position ? [{ rang: String(position) }] : [] };
    }
    return { rows: [] };
  });
  return calls;
}

const VALID_BODY = {
  id_ticket: 42,
  pouls: 110,
  tension_systolique: 115,
  saturation_o2: 95,
};

test('champs manquants : 400 sans aucun accès BDD', async (t) => {
  const calls = [];
  t.mock.method(db, 'query', async () => {
    calls.push('query');
    return { rows: [] };
  });

  const res = makeRes();
  const next = makeNext();
  await declarerUrgence(makeReq({ id_ticket: 1 }), res, next);

  assert.strictEqual(next.lastError.status, 400);
  assert.strictEqual(calls.length, 0);
});

test('identifiant de ticket non numérique : 400', async (t) => {
  const next = makeNext();
  await declarerUrgence(
    makeReq({ id_ticket: 'abc', pouls: 80, tension_systolique: 120, saturation_o2: 97 }),
    makeRes(),
    next
  );
  assert.strictEqual(next.lastError.status, 400);
});

test('ticket introuvable : 404 avec un message explicite', async (t) => {
  // Déclenche la rechercher via Ticket.findById → retour vide.
  mockDbQuery(t, { ticket: null });
  const res = makeRes();
  const next = makeNext();

  await declarerUrgence(makeReq(VALID_BODY), res, next);

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.lastError.status, 404);
  assert.match(next.lastError.message, /aucun ticket/i);
});

test('ticket sans patient : association automatique au patient anonyme (id 1)', async (t) => {
  const calls = mockDbQuery(t, { ticket: TICKET, cas: makeCas('VERT') });
  const res = makeRes();
  const next = makeNext();

  await declarerUrgence(makeReq(VALID_BODY), res, next);

  assert.strictEqual(next.lastError, undefined);
  const update = calls.find((c) => c.sql.includes('UPDATE t_ticket SET id_patient'));
  assert.ok(update, 'UPDATE associant le patient anonyme attendu');
  assert.strictEqual(update.params[0], 1); // ANONYMOUS_PATIENT_ID
  assert.strictEqual(update.params[1], 42);
  assert.strictEqual(res.body.data.id_patient, 1);
});

test('cas VERT : 201, alerte non déclenchée, position renvoyée', async (t) => {
  mockDbQuery(t, { ticket: { ...TICKET, id_patient: 1 }, cas: makeCas('VERT'), position: 5 });
  const res = makeRes();
  const next = makeNext();

  await declarerUrgence(makeReq(VALID_BODY), res, next);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.alerte, false);
  assert.strictEqual(res.body.message, 'Cas enregistré');
  assert.strictEqual(res.body.data.niveau_priorite, 'VERT');
  assert.strictEqual(res.body.data.position_file, 5);
  assert.strictEqual(res.body.data.id_ticket, 42);
  assert.strictEqual(res.body.data.numero_ticket, 7);
});

test('cas ROUGE : 201, alerte true et position prioritaire', async (t) => {
  mockDbQuery(t, { ticket: { ...TICKET, id_patient: 1 }, cas: makeCas('ROUGE'), position: 1 });
  const res = makeRes();
  const next = makeNext();

  await declarerUrgence(makeReq(VALID_BODY), res, next);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.alerte, true);
  assert.match(res.body.message, /Alerte ROUGE/);
  assert.strictEqual(res.body.data.position_file, 1);
});

test('erreur serveur : propagée à next()', async (t) => {
  const boom = new Error('panne BDD');
  t.mock.method(db, 'query', async () => {
    throw boom;
  });
  const next = makeNext();
  await declarerUrgence(makeReq(VALID_BODY), makeRes(), next);
  assert.strictEqual(next.lastError, boom);
});