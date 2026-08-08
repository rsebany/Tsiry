# Roadmap — Burin (UC3)

| | |
|---|---|
| **Responsable** | Burin |
| **Cas d'utilisation** | UC3 — S'enregistrer à l'arrivée |
| **Spec** | c3.pdf |
| **Acteur** | Patient |
| **Avancement** | ~100 % |
| **Branche archivée** | — (implémenté directement sur `main`) |

[← Index roadmap](../ROADMAP.md)

---

## Zone à entretenir (frontend)

- **Dossier exclusif : `frontend/src/features/kiosque/`**
  - `KiosqueView.jsx` — page publique `/kiosque` (plein écran, hors layout)
  - `components/KiosquePanel.jsx` — onglets `numero` / `recherche`
  - `hooks/useKiosqueRegister.js` — enregistrement présence (PATCH register)
- **Partagé (avec Nathan)** : `frontend/src/services/rendezvousService.js` → `registerPresence()`, `searchTodayAppointments()`
- **Backend** : `backend/src/controllers/rendezvousController.js` (registerPresence, searchTodayAppointments), `backend/src/models/RendezVous.js`

---

## État actuel

### Routes & API

| Type | Chemin |
|------|--------|
| UI | `/kiosque` (plein écran, hors layout) |
| API | `PATCH /rendezvous/:id/register` |
| API | `GET /rendezvous/search` (recherche par nom/prénom/téléphone) |

### Règles métier backend

- RDV doit être `PLANIFIE`
- Date du RDV = aujourd'hui
- Fenêtre horaire : ±30 min (standard) ou ±15 min (créneau proche)

### Tables SQL

- `t_rendez_vous` → statut passe à `PRESENT`

### Fichiers clés

| Couche | Fichier |
|--------|---------|
| Frontend | `frontend/src/features/kiosque/KiosqueView.jsx` |
| Frontend | `frontend/src/features/kiosque/components/KiosquePanel.jsx` (onglets `numero` / `recherche`) |
| Hook | `frontend/src/features/kiosque/hooks/useKiosqueRegister.js` |
| Service | `frontend/src/services/rendezvousService.js` → `registerPresence()`, `searchTodayAppointments()` |
| Backend | `backend/src/controllers/rendezvousController.js` → `registerPresence`, `searchTodayAppointments` |
| Modèle | `backend/src/models/RendezVous.js` → `updatePresence()`, `searchTodayByPatient()` |

---

## Ce qui fonctionne

- [x] Interface borne plein écran (fond sombre, gros chiffres)
- [x] Saisie numérique de l'`id_rdv`
- [x] Écran succès (5 s puis reset) avec nom + heure du RDV
- [x] Recherche fallback par nom/prénom/téléphone → liste des RDV du jour
- [x] Message erreur → redirection guichet
- [x] Seed demo : RDV #3 = `NOW() + 15 min` (après `db:init`)
- [x] Lien UC3 → UC4 : `GET /patients/present` alimente le guichet Jess
- [x] Scan QR : lecture auto de `?id_rdv=` à l'ouverture de `/kiosque` (query purgée après succès)
- [x] Validation horaire (±30 / ±15 min) couverte par tests automatisés (`node --test`)
- [x] Mode borne : plein écran + timeout d'inactivité 120 s
- [x] Impression badge « Présent » (`window.print` + CSS `@media print`)
- [x] QR généré à la confirmation UC1 (`BookingSuccessBanner`) et sur la liste UC2 (`AppointmentCard`, RDV du jour)

---

## Écarts / dette connue

| Écart | Détail |
|-------|--------|
| Saisie manuelle id | Gardée en fallback ; le patient sans QR peut toujours saisir son numéro RDV (ou utiliser la recherche) |
| Scanneur caméra à la borne | Non requis : scan par téléphone → URL `?id_rdv=` lue automatiquement |

---

## Dépendances

| Sens | UC | Lien |
|------|-----|------|
| **Amont** | UC1 + UC2 | RDV `PLANIFIE` créé et consultable |
| **Aval** | UC4 (Jess) | Statut `PRESENT` → dropdown patients au guichet |

---

## Roadmap — prochaines étapes

| Priorité | Tâche | Effort |
|----------|-------|--------|
| ~~P1~~ | ~~Scan QR code (encoder `id_rdv` ou token) via caméra / lecteur~~ ✅ (lecture `?id_rdv=` à la borne) | L |
| ~~P1~~ | ~~Générer QR à la confirmation UC1 ou sur UC2~~ ✅ (`BookingSuccessBanner`, `AppointmentCard`) | M |
| ~~P2~~ | ~~Recherche fallback : nom + téléphone → liste RDV du jour~~ ✅ | M |
| ~~P2~~ | ~~Afficher nom patient + heure RDV sur écran succès~~ ✅ | S |
| ~~P3~~ | ~~Mode borne dédié (plein écran, timeout inactivité)~~ ✅ | M |
| ~~P3~~ | ~~Impression badge « Présent »~~ ✅ | M |

> Plan d'exécution détaillé : [burin-uc3-plan.md](burin-uc3-plan.md)

---

## Critères « terminé » (100 %)

- [x] Enregistrement par QR sans saisie manuelle (lecture `?id_rdv=` à la borne)
- [x] Fallback recherche patient si QR indisponible
- [x] Validation horaire couverte par tests automatisés (`cd backend && npm test`)
- [x] Chaîne UC1 → UC3 → UC4 validée en démo
- [x] Interface utilisable sur écran tactile 10"
- [x] QR généré côté patient (confirmation UC1 / liste UC2)

---

## Test rapide

```bash
cd backend && npm run db:init && npm start
cd frontend && npm start
```

1. Ouvrir http://localhost:5173/kiosque
2. Saisir **3** (RDV demo du jour)
3. Confirmer → écran vert succès
4. Vérifier dans `/file-attente` que le patient apparaît dans « Patients présents (UC3)»
