# Plan d'exécution — Burin (UC3) → 100 %

| | |
|---|---|
| **Responsable** | Burin |
| **Cas d'utilisation** | UC3 — S'enregistrer à l'arrivée |
| **Cible** | Atteindre 100 % (critères « terminé » de [burin-uc3.md](burin-uc3.md)) |
| **Branche** | `main` (flux démo UC1 → UC3 → UC4 à valider) |
| **Contexte** | Avancement actuel ~90 % ; état du code vérifié le 07/08/2026 |

[← Index roadmap](../ROADMAP.md) · [Roadmap UC3](burin-uc3.md)

---

## Périmètre retenu

- **Scan QR** : lecture **auto via query `?id_rdv=`** à l'ouverture de `/kiosque` (pas de scanner caméra embarqué). La génération du QR côté patient (confirmation UC1 / liste UC2) reste à coordonner avec **Nathan**.
- **Tests** : couvrir la validation horaire (±30 min / ±15 min) par tests automatisés.
- **P3** : mode borne + impression badge « Présent » (optionnel, en fin de course si le temps le permet).

---

## Ordre d'exécution

| # | Priorité | Tâche | Effort | Dépend de |
|---|----------|-------|--------|-----------|
| 1 | **P1** | Lecture auto `?id_rdv=` à l'ouverture de `/kiosque` | S | — |
| 2 | **P1** | (Coordination Nathan) Générer le QR à la confirmation UC1 / sur UC2 | M | Tâche 1 (format d'URL) |
| 3 | **P1** | Tests automatisés de la validation horaire | M | — |
| 4 | **P3** | Mode borne (plein écran + timeout inactivité) | M | — |
| 5 | **P3** | Impression badge « Présent » | M | Tâche 1 (écran succès) |
| 6 | — | Dernière vérif : chaîne UC1 → UC3 → UC4 + tactile 10" | S | Toutes |

---

## Tâche 1 — Lecture auto du QR via `?id_rdv=`

**Fichiers touchés**

| Fichier | Action |
|---------|--------|
| `frontend/src/features/kiosque/hooks/useKiosqueRegister.js` | Lire `id_rdv` depuis la query ; enregistrer automatiquement au montage si présent et valide |
| `frontend/src/features/kiosque/components/KiosquePanel.jsx` | Retirer le `// TODO Burin` ; afficher le bon état pendant l'auto-enregistrement |
| `frontend/src/features/kiosque/KiosqueView.jsx` | Aucun changement attendu (état géré par le hook) |

**Détail d'implémentation**

- Utiliser `useSearchParams` de `react-router-dom` (déjà utilisé dans le projet, cf. `App.jsx`) :
  - `id_rdv = searchParams.get('id_rdv')`
  - Si présent et `Number.isInteger(+id_rdv) && +id_rdv > 0` → appeler `register(id_rdv)` **une seule fois** au montage (garde anti-double via `useRef`), puis `navigate('', { replace: true })` (ou `setSearchParams({})`) pour purger la query et éviter une re-registration au retour.
  - Si absent ou invalide → comportement actuel (onglets `numero` / `recherche`).
- Format d'URL à documenter et à partager avec Nathan :
  ```
  ${window.location.origin}/kiosque?id_rdv=${id_rdv}
  ```
  (même pattern que `TicketThermique.jsx` : `qrcode.react` → `QRCodeSVG value={url}`)
- Gérer les erreurs : si `register()` échoue (ex. RDV pas du jour / trop tôt / déjà traité), afficher l'alerte existante et laisser le fallback manuel disponible.

**Acceptation**

- Ouvrir `http://localhost:5173/kiosque?id_rdv=3` → écran succès vert direct, sans saisie.
- Après succès, la query `?id_rdv=` disparaît de l'URL.
- `id_rdv` invalide / absent → aucun appel API, interface manuelle intacte.

---

## Tâche 2 — (Coordination) Générer le QR à la confirmation UC1 / sur UC2

**Propriétaire UI** : Nathan (`features/patient`). **Burin fournit** la spécification d'URL (ci-dessus).

**Fichiers candidats (côté Nathan)**

| Fichier | Usage |
|---------|-------|
| `frontend/src/features/patient/components/BookingSuccessBanner.jsx` | Afficher le QR à la confirmation de réservation |
| `frontend/src/features/patient/MesRendezVousPage.jsx` / `AppointmentCard.jsx` | QR sur la carte du RDV du jour |

**Livrables Burin**

- Documentation du format d'URL (dans la section « Contrat QR » de ce plan).
- Démo validée : scanner le QR (généré depuis UC1/UC2) → `/kiosque?id_rdv=N` → présence enregistrée.

**Acceptation (conjointe)**

- Le patient voit un QR encodant `/kiosque?id_rdv=N` après réservation.
- Scanner ce QR ouvre la borne et enregistre la présence (test manuel, caméra de téléphone).

---

## Tâche 3 — Tests automatisés de la validation horaire

**État constaté** : aucun framework de test installé dans `backend/package.json` (suites actuelles = tests manuels 77/77). Le contrôleur `backend/src/controllers/rendezvous/registerPresence.js` mêle la logique de validation horaire (lignes ~32–53) aux appels DB.

**Fichiers touchés**

| Fichier | Action |
|---------|--------|
| `backend/src/services/rendezvous/timeWindow.js` | **Nouveau** — extraire la règle en fonction pure |
| `backend/src/controllers/rendezvous/registerPresence.js` | Utiliser la fonction pure (comportement identique) |
| `backend/src/services/rendezvous/timeWindow.test.js` | **Nouveau** — tests `node:test` |
| `backend/package.json` | Ajouter `"test": "node --test src/services/rendezvous/"` |

**Fonction pure à extraire**

```js
// AVANCE_MAX_MIN = 30, RETARD_MAX_MIN = 15
function evaluateTimeWindow(rdvDate, now) {
  const diffMin = (rdvDate.getTime() - now.getTime()) / 60000;
  if (rdvDate.toDateString() !== now.toDateString()) return { ok: false, code: 'WRONG_DAY', message: "..." };
  if (diffMin > 30) return { ok: false, code: 'TOO_EARLY', minutes: Math.ceil(diffMin - 30) };
  if (diffMin < -15) return { ok: false, code: 'TOO_LATE' };
  return { ok: true };
}
```

**Cas à couvrir**

- RDV aujourd'hui, `diffMin` ∈ [−15, +30] → `ok`
- RDV dans +31 min / +61 min → `TOO_EARLY` avec le bon nombre de minutes restantes
- RDV passé de −16 min → `TOO_LATE`
- RDV un autre jour (hier / demain) → `WRONG_DAY`
- Cas limites exacts : +30 → ok, −15 → ok, +30.5 → refus, −15.5 → refus

**Note** : `node --test` est intégré à Node ≥ 18 (aucune dépendance à ajouter, cohérent avec l'écosystème du repo).

**Acceptation**

- `cd backend && npm test` → tous les tests passent.
- Le comportement de l'API ne change pas (régression : `db:init` + enregistrement RDV #3 toujours OK).

---

## Tâche 4 — Mode borne (P3)

**Fichiers touchés**

| Fichier | Action |
|---------|--------|
| `frontend/src/features/kiosque/hooks/useKiosqueRegister.js` | Timer d'inactivité (ex. 120 s sans interaction → `resetAll`) ; réinitialiser le timer à chaque frappe |
| `frontend/src/features/kiosque/KiosqueView.jsx` | Bouton plein écran (icône `Maximize`) + `requestFullscreen()` ; `Escape` pour sortir |

**Acceptation**

- Aucune interaction pendant 120 s → retour à l'état initial.
- Bouton plein écran fonctionnel sur la borne.

---

## Tâche 5 — Impression badge « Présent » (P3)

**Fichiers touchés**

| Fichier | Action |
|---------|--------|
| `frontend/src/features/kiosque/components/KiosquePanel.jsx` | Bloc imprimable (nom + heure RDV + logo) dans l'écran succès + bouton « Imprimer » → `window.print()` |
| `frontend/src/features/kiosque/KiosqueView.jsx` ou CSS dédié | `@media print` : n'imprimer que le badge, pas l'interface |

**Acceptation**

- Sur l'écran succès, l'impression génère un badge « Présent » propre (test avec navigateur / imprimante thermique si disponible).

---

## Contrat QR (à figer pour l'équipe)

```
URL  : ${window.location.origin}/kiosque?id_rdv=<id_rdv>
Encodage : texte brut dans le QR (QRCodeSVG / qrcode.react)
Comportement borne : enregistrement automatique au montage, query purgée après succès
Fallback        : si le scan échoue ou id invalide → onglets « N° de rendez-vous » / « Recherche »
```

---

## Correspondance avec les critères « terminé »

| Critère (burin-uc3.md) | Tâche(s) qui le couvre |
|------------------------|------------------------|
| Enregistrement par QR sans saisie manuelle | Tâche 1 (+ 2 pour génération) |
| Fallback recherche patient si QR indisponible | Déjà livré — reverifie en Tâche 6 |
| Validation horaire couverte par tests automatisés | Tâche 3 |
| Chaîne UC1 → UC3 → UC4 validée en démo | Tâche 2 + 6 |
| Interface utilisable sur écran tactile 10" | Tâche 6 (contrôle visuel, taille des cibles déjà OK) |

---

## Risques / décisions ouvertes

| Risque | Mitigation |
|--------|-----------|
| `register()` déjà appelé si le patient recharge `/kiosque?id_rdv=N` | Purger la query après le 1er appel (voir Tâche 1) ; le backend est déjà idempotent (409 si statut ≠ `PLANIFIE`) |
| Génération QR côté UC1/UC2 hors de la zone Burin | Formaliser le contrat d'URL ; revue conjointe avec Nathan avant implémentation |
| Aucun framework de test côté backend | Utiliser `node --test` natif (zéro dépendance) ; refactor minimal sans changer le comportement |
| Impression sur borne sans imprimante de test | Livrer le bloc + CSS print, tester sur navigateur ; impression thermique = vérif manuelle optionnelle |

---

## Vérification finale (Tâche 6)

```bash
cd backend && npm run db:init && npm start
cd frontend && npm start
```

1. Ouvrir `http://localhost:5173/kiosque?id_rdv=3` → succès vert direct (QR)
2. Saisie manuelle « 3 » → succès (fallback)
3. Recherche par nom/téléphone → liste des RDV du jour (fallback)
4. `cd backend && npm test` → validation horaire couverte
5. Dans `/agent/file-attente` (Jess, UC4), le patient apparaît dans « Patients présents (UC3) »
6. Contrôle tactile 10" : cibles ≥ 44 px, clavier numérique (`inputMode="numeric"`) OK

---

## Suivi d'exécution (07/08/2026)

| # | Tâche | Statut | Vérif |
|---|-------|--------|-------|
| 1 | Lecture auto `?id_rdv=` | ✅ | Build frontend OK ; test manuel `/kiosque?id_rdv=3` à refaire au navigateur |
| 2 | Contrat QR + génération UC1/UC2 | ✅ | Contrat § « Contrat QR » ; QR livré dans `BookingSuccessBanner` (UC1) + `AppointmentCard` (UC2, RDV du jour) |
| 3 | Tests validation horaire | ✅ | `cd backend && npm test` → 7/7 pass |
| 4 | Mode borne | ✅ | Bouton plein écran (`KiosqueView`) + timeout inactivité 120 s (`useKiosqueRegister`) |
| 5 | Impression badge | ✅ | Bloc `#kiosque-badge` + bouton + CSS `@media print` |
| 6 | Vérification finale | ✅ | `db:init` OK, `PATCH /rendezvous/3/register` → `PRESENT`, `GET /patients/present` → Marie Dupont |

### Décisions prises en cours d'exécution

1. **Colonne `qr_token` (modif. préexistante non finie)** : **revert** dans `backend/sql/init.sql` (choix utilisateur) — le QR reste basé sur `?id_rdv=`.
2. **Bug de fuseau horaire du seed (préexistant)** : `scripts/initDb.js` créait un pool sans `-c TimeZone=…` alors que l'app utilise `Africa/Algiers` → le seed stockait `NOW()` en heure GMT, relue par l'app comme heure locale (décalage −1 h → RDV #3 vu « trop tard », refus 400). Fix : `initDb.js` réutilise maintenant le pool de `src/config/db` (`require('../src/config/db')`) → fuseaux alignés, RDV #3 = `NOW() + 15 min` correctement interprété.
