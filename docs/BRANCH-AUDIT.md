# Audit des branches — Système de Gestion Hospitalière

Document de référence décrivant l'état de chaque branche, les erreurs identifiées, et les corrections appliquées sur `feature/integration-all-ucs` puis `main`.

**Dépôt :** [rsebany/systeme-gestion-hospitaliere](https://github.com/rsebany/systeme-gestion-hospitaliere)

> **Roadmap par responsable UC :** [docs/ROADMAP.md](ROADMAP.md) — état actuel et prochaines étapes pour chaque membre de l'équipe (Romualdo, Nathan, Burin, Jess, Steaven, Orneda, Clova).

---

## Vue d'ensemble

| Branche | Responsable | UC | État avant intégration | Action |
|---------|-------------|-----|------------------------|--------|
| `main` | Équipe | UC1 intégré | UC2 stub, pas de tickets | Corrigé via intégration |
| `feature/uc1-romualdo` | Romualdo | UC1 | Déjà fusionné, 3 commits de retard | Archiver / rebaser |
| `feature/uc2-nathan` | Nathan | UC2 | Réécriture parallèle, supprime UC1 | UC2 porté additivement |
| `feature/uc4-uc5-jess` | Jess | UC4–UC5 | Code mort, routes cassées | Porté avec corrections |
| `feature/uc6-steaven` | Steaven | UC6 | Partiel, supprime UC1 | Porté après UC4/UC5 |

---

## `main`

**Dernier commit (avant intégration) :** `d5ae83b` — Merge branch 'feature/uc1-romualdo' into main

### Erreurs identifiées

| Sévérité | Problème | Fichier(s) |
|----------|----------|------------|
| Moyenne | UC2 non implémenté — stub placeholder | `frontend/src/views/MesRendezVousView.jsx` |
| Moyenne | Pas de tables ticket / file d'attente | `backend/sql/init.sql` |
| Moyenne | Proxy Vite `/api` dev-only — production nécessite `VITE_API_URL` | `frontend/vite.config.js`, `frontend/src/services/api.js` |
| Basse | README incomplet (`db:init`, routes UC manquantes) | `README.md` |

### Corrections appliquées

- Intégration UC2, UC4, UC5, UC6 depuis les branches feature (voir sections ci-dessous)
- Extension du schéma SQL
- Documentation README et ce fichier

---

## `feature/uc1-romualdo`

**Dernier commit :** `092b704` — updates  
**Divergence vs main :** 0 en avance / 3 en retard (`.gitattributes` manquant)

### Erreurs identifiées

**Aucune erreur de code.** UC1 (Prendre rendez-vous) est fonctionnel et déjà fusionné dans `main`.

| Sévérité | Problème |
|----------|----------|
| Basse | Branche stale — ne contient pas le merge final ni `.gitattributes` |

### Recommandation

Supprimer ou rebaser sur `main` après intégration complète.

---

## `feature/uc2-nathan`

**Dernier commit :** `4603d54` — test and customization done  
**Divergence vs main :** 3 en avance / 8 en retard

### Erreurs identifiées

| Sévérité | Problème | Détail |
|----------|----------|--------|
| Critique | Supprime UC1 | Remplace `bookAppointment` par `getPatientAppointments` uniquement |
| Critique | Conflits de merge | `.gitignore`, `backend/package.json`, `backend/server.js`, `frontend/package.json` |
| Critique | Pas de `init.sql` | Impossible d'initialiser la base sur un clone frais |
| Haute | ID patient incorrect | `EspaceSante.jsx` hardcode `idPatientConnecte = 2` — seed n'a que patient id **1** |
| Haute | Pas de `.env.example` | Credentials DB non documentés |
| Moyenne | API non standard | URL hardcodée `http://localhost:3000/api` au lieu du proxy Vite |
| Moyenne | Pas de react-router | App standalone sans navigation vers UC1 |
| Basse | Fuite debug | `db.js` log le mot de passe |
| Basse | Script manquant | `frontend/package.json` sans `"start"` |

### Corrections portées sur main

- `GET /patients/:id/rendezvous` dans `rendezvousRoutes.js`
- `findByPatient()` dans `RendezVous.js`
- `MesRendezVousView.jsx` remplace le stub (patient demo id **1**)
- `rendezvousUtils.js` pour badges de statut

---

## `feature/uc4-uc5-jess`

**Dernier commit :** `166de06` — malagasy  
**Divergence vs main :** 1 en avance / 4 en retard

### Erreurs identifiées

| Sévérité | Problème | Fichier |
|----------|----------|---------|
| Critique | Code mort après `app.listen()` | `backend/server.js` — imports `patientRoutes` jamais exécutés |
| Critique | Route après `module.exports` | `backend/src/routes/ticketRoutes.js` — `/patients/present` non enregistrée |
| Critique | Schéma SQL absent | Pas de `t_ticket` / `t_file_attente` dans le dépôt |
| Critique | Supprime UC1 | Tout le stack rendez-vous retiré |
| Haute | Conflits de merge | 4 fichiers en conflit avec `main` |
| Moyenne | URL API hardcodée | `frontend/src/services/api.js` → `localhost:3000` |
| Moyenne | `.env.example` supprimés | Backend et frontend |
| Basse | `/patients/present` stub vide | Toujours `data: []` même si corrigé côté route |

### Corrections portées sur main

- Routes ticket **avant** `module.exports`
- Pas de code après `app.listen()`
- Tables + seed dans `init.sql`
- Routes sans préfixe `/api` (proxy Vite)
- `TicketQueueView` à `/file-attente`

---

## `feature/uc6-steaven`

**Dernier commit :** `e5d45ec` — fix: correction appel API pour compatibilité proxy Vite  
**Divergence vs main :** 2 en avance / 4 en retard

### Erreurs identifiées

| Sévérité | Problème | Fichier |
|----------|----------|---------|
| Critique | UC6 partiel | Seul `GET /tickets/:id/status` — pas de création ticket |
| Critique | Pas de `init.sql` | Table `t_ticket` absente |
| Critique | Supprime UC1 | Stack rendez-vous retiré |
| Haute | Conflits merge | `server.js`, `App.jsx`, `package-lock.json` |
| Moyenne | API incohérente | `checkHealth` via proxy, `getTicketStatus` via `:3000` hardcodé |
| Moyenne | Demo hardcodée | `<TicketStatusView ticketId={1} />` sans route param |
| Basse | Pas de react-router | Vue affichée en permanence |

### Corrections portées sur main

- `getTicketStatus` fusionné dans `Ticket.js` + `ticketController.js`
- Route `/ticket/:id/statut` avec param dynamique
- Tous les appels via `api.js` (`baseURL: '/api'`)

---

## Démarrage après corrections

### Prérequis

- Node.js 18+
- PostgreSQL avec base `hospital_db`

### Backend

```bash
cd backend
cp .env.example .env    # renseigner DB_HOST, DB_USER, DB_PASSWORD, etc.
npm install
npm run db:init         # crée tables + données de test
npm start               # port 3000
```

### Frontend

```bash
cd frontend
cp .env.example .env    # optionnel en dev
npm install
npm start               # port 5173, proxy /api → :3000
```

### Production frontend

Définir `VITE_API_URL` vers l'URL complète du backend (ex. `https://api.example.com`).

### Routes UI

| Route | UC | Description |
|-------|-----|-------------|
| `/` | — | Accueil + état API |
| `/prendre-rendez-vous` | UC1 | Réservation |
| `/mes-rendez-vous` | UC2 | Historique patient (demo id 1) |
| `/file-attente` | UC4–UC5 | File d'attente + distribution tickets |
| `/kiosque` | UC3 | Borne enregistrement présence |
| `/ticket/:id/statut` | UC6 | Suivi statut ticket (ex. `/ticket/1/statut`) |
| `/urgences/declare` | UC7–UC8 | Triage urgences (Orneda) |
| `/medecin/appel` | UC10 | Appel patient en box (Clova) |
| `/carte` | UC11 | Carte hôpitaux Leaflet (Clova) |
| `/moniteur` | UC9 | Moniteur public file d'attente (priorité urgences) |

---

## Milestone ~60% global + Orneda/Clova (~60% chacun)

| Module | Avancement | Détail |
|--------|------------|--------|
| C1 UC1 | ~95% | Inchangé |
| C2 UC2 | ~90% | Titre « Mon Espace Santé » |
| C3 UC3 | ~70% | `PATCH /rendezvous/:id/register`, `/kiosque` (sans QR) |
| C4/C5 | ~75% | Lien C3→C4 via `PRESENT`, PATCH call/close C5 |
| Steaven | ~65% | Lien ticket thermique → statut |
| **C6 Orneda** | **~60%** | `t_cas_urgence`, score gravité ROUGE→VERT, `/urgences/declare`, lien `id_patient` sur tickets |
| **C7 Clova** | **~60%** | File priorisée, moniteur + box, `/medecin/appel`, carte Leaflet `/carte` |

**Flux démo :** Réserver (UC1) → Kiosque (UC3) → Guichet ticket avec `id_patient` (UC4) → Déclarer urgence (UC7) → Moniteur (UC9) → Appel box (UC10) → Carte (UC11).

**Non implémenté volontairement (40% restant) :** re-priorisation temps réel automatique, alertes sonores, auth JWT, QR borne, animations TV, géolocalisation live.

### Alignement FE / BE / UML (post-audit)

| Correction | Détail |
|------------|--------|
| Cycle ticket unifié | Guichet : `PATCH /call` → `EN_COURS`, `PATCH /close` → `TRAITE` ; médecin : `trigger-call` → `EN_CONSULTATION` |
| Priorité guichet | Colonne `niveau_priorite` affichée dans `/file-attente` |
| LDM `t_file_attente` | Colonne renommée `date_du_jour` |
| LDM `t_cas_urgence` | Ajout `score_gravite`, `id_medecin` ; tri file par score |
| Routes legacy | `PUT /tickets/appeler`, `PUT /tickets/:id/terminer` conservées API, non utilisées UI |
| Extension UC11 | `t_hopital` hors LDM initial — documenté |

### Connexion GitHub (SSH)

Si `git fetch` échoue avec `Permission denied (publickey)` :

1. Copier la clé publique : `~/.ssh/id_ed25519.pub`
2. Ajouter sur [github.com/settings/ssh/new](https://github.com/settings/ssh/new)
3. Vérifier : `ssh -T git@github.com`

Alternative : configurer `credential.helper manager` et remote HTTPS.

---

## Branches feature — statut post-intégration

Les branches `feature/uc2-nathan`, `feature/uc4-uc5-jess`, `feature/uc6-steaven` restent **archivées** telles quelles sur GitHub. Ne pas les fusionner directement dans `main` — elles contiennent des réécritures incompatibles. Utiliser `main` (ou `feature/integration-all-ucs` avant merge) comme référence unique.
