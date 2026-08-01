# Roadmap — Jess (UC4 / UC5)

| | |
|---|---|
| **Responsable** | Jess |
| **Cas d'utilisation** | UC4 — Gérer file d'attente / UC5 — Attribuer numéro |
| **Spec** | c4.pdf, c5.pdf |
| **Acteur** | Agent d'accueil |
| **Avancement** | ~85 % |
| **Branche archivée** | `feature/uc4-uc5-jess` (porté avec corrections sur `main`) |

[← Index roadmap](../ROADMAP.md)

---

## État actuel

### Routes & API

| Type | Chemin |
|------|--------|
| UI | `/file-attente` |
| API | `GET /file-attente` |
| API | `POST /tickets/generate` |
| API | `GET /patients/present` |
| API | `PATCH /tickets/:id/call` → `EN_COURS` |
| API | `PATCH /tickets/:id/close` → `TRAITE` |

### Tables SQL

- `t_file_attente` (`date_du_jour`)
- `t_ticket` (`numero`, `statut`, `id_patient`, `patient_nom`, `patient_prenom`, `numero_box`)

### Fichiers clés

| Couche | Fichier |
|--------|---------|
| Frontend | `frontend/src/views/TicketQueueView.jsx` |
| Frontend | `frontend/src/views/TicketGenerator.jsx` |
| Frontend | `frontend/src/views/FileAttente.jsx` |
| Frontend | `frontend/src/components/TicketThermique.jsx` |
| Service | `frontend/src/services/ticketService.js` |
| Backend | `backend/src/controllers/ticketController.js` |
| Modèle | `backend/src/models/Ticket.js`, `FileAttente.js` |

---

## Ce qui fonctionne

- [x] Distribution ticket (manuel ou patient présent UC3)
- [x] Ticket thermique modal avec lien statut UC6
- [x] File active avec stats (en attente / en cours / terminés)
- [x] Appel prochain → `PATCH /call` (`EN_COURS`)
- [x] Clôture ticket → `PATCH /close` (`TRAITE`)
- [x] Gestion `EN_CONSULTATION` (tickets appelés par médecin UC10)
- [x] Colonne priorité urgence (badges ROUGE → VERT)
- [x] Tri backend par `score_gravite` (UC8)
- [x] `id_patient` envoyé depuis le dropdown « Patients présents (UC3) »
- [x] Avertissement si saisie manuelle alors que des patients présents sont disponibles (lien rompu → pas de priorité urgence)

---

## Écarts / dette connue

| Écart | Détail |
|-------|--------|
| Nav patient partagée | Pas d'écran agent dédié |
| Routes legacy API | `PUT /tickets/appeler`, `PUT /terminer` conservées mais non utilisées UI |
| Multi-services | Une seule file par jour, pas de files par spécialité |

---

## Dépendances

| Sens | UC | Lien |
|------|-----|------|
| **Amont** | UC3 (Burin) | Patients `PRESENT` pré-remplissent le formulaire |
| **Amont** | UC8 (Orneda) | Priorité urgences si `id_patient` lié |
| **Aval** | UC6 (Steaven) | Ticket thermique → suivi statut |
| **Aval** | UC9–10 (Clova) | File alimente moniteur et appel médecin |

---

## Roadmap — prochaines étapes

| Priorité | Tâche | Effort |
|----------|-------|--------|
| ~~P1~~ | ~~Avertir / bloquer saisie manuelle si patient présent non sélectionné~~ ✅ | S |
| ~~P1~~ | ~~Toujours envoyer `id_patient` depuis dropdown UC3~~ ✅ | S |
| **P2** | Layout agent dédié (sans liens patient : RDV, kiosk) | M |
| **P2** | Stats journalières : tickets/heure, temps d'attente moyen | M |
| **P2** | Supprimer ou documenter définitivement routes legacy PUT | S |
| **P3** | Multi-files par service / spécialité | L |
| **P3** | Impression ticket ESC/POS | M |

---

## Critères « terminé » (100 %)

- [ ] Agent peut gérer toute la file sans écran médecin
- [ ] 100 % des tickets liés à un `id_patient` quand issus du kiosk
- [ ] Cycle statuts unifié documenté (`EN_ATTENTE` → `EN_COURS` / `EN_CONSULTATION` → `TRAITE`)
- [ ] UC5 `<<include>>` UC4 validé dans le diagramme UC
- [ ] Tests sur génération + appel + clôture

---

## Test rapide

```bash
cd backend && npm run db:init && npm start
cd frontend && npm start
```

1. Kiosk : enregistrer RDV #3 (UC3)
2. `/file-attente` → sélectionner patient présent → distribuer ticket
3. « Appeler prochain patient » → statut `EN_COURS`
4. « Clôturer » → statut `TRAITE`
