# Roadmap — Clova (UC9 / UC10 / UC11)

| | |
|---|---|
| **Responsable** | Clova |
| **Cas d'utilisation** | UC9 — Consulter liste d'attente / UC10 — Appeler patient / UC11 — Cartographie |
| **Spec** | c7.pdf |
| **Acteurs** | Médecin (UC9–10), Public (UC11) |
| **Avancement** | ~85 % |
| **Branche archivée** | — (implémenté sur `main`) |

[← Index roadmap](../ROADMAP.md)

---

## Zone à entretenir (frontend)

- **Dossiers exclusifs :**
  - `frontend/src/features/moniteur/` — `MoniteurView.jsx`, `components/` (`MoniteurCurrentCall`, `MoniteurWaitingList`), `hooks/useMoniteurQueue.js`
  - `frontend/src/features/medecin/` — `MedecinDashboard.jsx`, `ConsultationPage.jsx`, `HistoriquePatientPage.jsx`, `components/Vitals.jsx`, `hooks/useMedecinQueue.js`, `useHistoriquePatient.js`
  - `frontend/src/features/carte/` — `CarteHopitauxView.jsx`, `hooks/useCarteHopitaux.js`
- **Partagés :** `frontend/src/services/ticketService.js` (OWNER Clova), `frontend/src/components/PriorityBadge.jsx` (OWNER Clova), `frontend/src/utils/soundAlert.js`
- **Partagé (avec Jess)** : `frontend/src/services/urgenceService.js` (Jess/Clova)
- **Backend** : `backend/src/controllers/ticket/`, `urgenceController.js` ; modèles `backend/src/models/ticket/`, `Hopital.js`

---

## État actuel

### Routes & API

| UC | UI | API |
|----|-----|-----|
| UC9 | `/moniteur`, `/moniteur/tv` | `GET /queue/active` |
| UC10 | `/medecin/consultation` | `PATCH /tickets/:id/trigger-call` + `{ numero_box }` |
| UC11 | `/carte` | `GET /hopitaux` |

### Tables SQL

- `t_ticket` (`numero_box`, statut `EN_CONSULTATION`)
- `t_hopital` (nom, latitude, longitude, type) — extension hors LDM initial

### Fichiers clés

| Couche | Fichier |
|--------|---------|
| Frontend UC9 | `frontend/src/features/moniteur/MoniteurView.jsx` |
| Frontend UC10 | `frontend/src/features/medecin/ConsultationPage.jsx` (console unifiée UC9+UC10) |
| Frontend UC11 | `frontend/src/features/carte/CarteHopitauxView.jsx` |
| Composant | `frontend/src/components/PriorityBadge.jsx` |
| Service | `frontend/src/services/ticketService.js`, `urgenceService.js` |
| Backend | `backend/src/controllers/ticket/`, `urgenceController.js` |
| Modèle | `backend/src/models/ticket/`, `Hopital.js` |

---

## Ce qui fonctionne

- [x] Moniteur public : numéro en cours, box, prochains numéros (priorité urgences)
- [x] Rafraîchissement auto 5 s
- [x] Animation flash numéro + box à chaque nouvel appel (pulse 3×, sonnée)
- [x] Mode TV plein écran `/moniteur/tv` (sans scroll, typo agrandie)
- [x] Console médecin unifiée UC9+UC10 : patient en consultation (constantes vitales) + file à appeler (box) même écran
- [x] Vue médecin : liste triée + saisie box + appel → `EN_CONSULTATION`
- [x] Carte Leaflet Antananarivo (4 établissements seed)
- [x] Badges priorité ROUGE → VERT
- [x] Clôture possible depuis guichet Jess (statut `EN_CONSULTATION`)

---

## Écarts / dette connue

| Écart | Détail |
|-------|--------|
| Carte statique | Pas de géolocalisation live ni itinéraire |
| `t_hopital` hors LDM | Documenté comme extension UC11 |
| Pas d'auth médecin | Route `/medecin/appel` publique |

---

## Dépendances

| Sens | UC | Lien |
|------|-----|------|
| **Amont** | UC4/5 (Jess) | Tickets alimentent la file |
| **Amont** | UC8 | Tri par `score_gravite` |
| **Aval** | UC6 | Patient voit box sur statut (à compléter) |

---

## Roadmap — prochaines étapes

| Priorité | Tâche | Effort |
|----------|-------|--------|
| ~~P1~~ | ~~Animation moniteur : flash numéro + box à l'appel~~ ✅ | M |
| ~~P1~~ | ~~Mode TV plein écran (`/moniteur/tv`) sans scroll, typo agrandie~~ ✅ | S |
| ~~P2~~ | ~~Console médecin unifiée UC9+UC10 (liste + appel même écran)~~ ✅ | M |
| **P2** | Auth médecin sur `/medecin/appel` | M |
| **P3** | Géolocalisation patient + hôpital le plus proche (UC11) | L |
| **P3** | Filtres carte par type (CHU, Privé, Public) | S |
| **P3** | Itinéraire Leaflet Routing Machine | M |

---

## Critères « terminé » (100 %)

- [ ] Moniteur utilisable sur écran 55" en salle d'attente
- [ ] Médecin appelle et clôturer depuis une seule interface
- [ ] UC10 intégré au flux guichet (statuts cohérents)
- [ ] Carte interactive avec recherche et filtres
- [ ] Tests sur `GET /queue/active` et `PATCH /trigger-call`

---

## Test rapide

```bash
cd backend && npm run db:init && npm start
cd frontend && npm install && npm start
```

1. Créer tickets via `/file-attente`
2. http://localhost:5173/moniteur — vérifier numéros et priorités
3. http://localhost:5173/moniteur/tv — mode TV plein écran, flash à l'appel
4. http://localhost:5173/medecin/appel — appeler ticket #1, box **A3** (patient en cours + vitals en haut)
5. Moniteur → « En consultation », box **A3**
6. http://localhost:5173/carte — 4 marqueurs Antananarivo
