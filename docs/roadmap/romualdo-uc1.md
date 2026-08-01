# Roadmap — Romualdo (UC1)

| | |
|---|---|
| **Responsable** | Romualdo |
| **Cas d'utilisation** | UC1 — Prendre rendez-vous |
| **Spec** | c1-romualdo.pdf |
| **Acteur** | Patient |
| **Avancement** | ~97 % |
| **Branche archivée** | `feature/uc1-romualdo` (fusionnée dans `main`) |

[← Index roadmap](../ROADMAP.md)

---

## État actuel

### Routes & API

| Type | Chemin |
|------|--------|
| UI | `/prendre-rendez-vous` |
| API | `POST /rendezvous/book` |
| API | `GET /specialites`, `GET /medecins`, `GET /patients` |

### Tables SQL

- `t_utilisateur` (patients + médecins)
- `t_rendez_vous` (création RDV `PLANIFIE`)

### Fichiers clés

| Couche | Fichier |
|--------|---------|
| Frontend | `frontend/src/views/BookAppointmentView.jsx` |
| Service | `frontend/src/services/rendezvousService.js` |
| Backend | `backend/src/controllers/rendezvousController.js` |
| Modèle | `backend/src/models/RendezVous.js` |
| Routes | `backend/src/routes/rendezvousRoutes.js` |

---

## Ce qui fonctionne

- [x] Formulaire : patient, spécialité, médecin, date/heure, motif
- [x] Anti-collision créneau médecin (HTTP 409 si conflit)
- [x] Liste dynamique médecins filtrée par spécialité
- [x] Écran de confirmation après réservation
- [x] Lien navigation depuis le layout principal
- [x] Validation client : date/heure passée bloquée (`min` dynamique + message)
- [x] Règles horaires : pas de dimanche, plage 8h–18h (backend + frontend, `validateSlot`)

---

## Écarts / dette connue

| Écart | Détail |
|-------|--------|
| Pas d'auth | Le patient est sélectionné dans une liste, pas connecté |
| Pas d'annulation | Aucun flux pour annuler ou modifier un RDV |
| Pas de confirmation email | Notification externe absente |

---

## Dépendances

| Sens | UC | Lien |
|------|-----|------|
| **Amont** | — | Point d'entrée du parcours patient |
| **Aval** | UC2 (Nathan) | Le patient consulte ses RDV créés |
| **Aval** | UC3 (Burin) | Le RDV `PLANIFIE` devient `PRESENT` au kiosk |

---

## Roadmap — prochaines étapes

| Priorité | Tâche | Effort |
|----------|-------|--------|
| ~~P1~~ | ~~Validation client : interdire date/heure passée~~ ✅ | S |
| ~~P1~~ | ~~Créneaux horaires (pas de dimanche, 8h–18h)~~ ✅ | M |
| **P2** | Intégrer auth patient (remplacer sélection manuelle `id_patient`) | L |
| **P2** | `PATCH /rendezvous/:id/cancel` + bouton annuler depuis UC2 | M |
| **P3** | Email / SMS de confirmation après réservation | L |
| **P3** | Rappel J-1 avant le RDV | L |

*Effort : S = small, M = medium, L = large*

---

## Critères « terminé » (100 %)

- [ ] Patient authentifié peut réserver sans sélectionner manuellement son id
- [ ] Conflits et validations couverts backend + frontend
- [ ] Annulation RDV possible tant que statut = `PLANIFIE`
- [ ] Confirmation envoyée au patient (email ou SMS)
- [ ] Tests API sur `POST /rendezvous/book` (cas nominal + 409)

---

## Test rapide

```bash
cd backend && npm run db:init && npm start
cd frontend && npm start
```

1. Ouvrir http://localhost:5173/prendre-rendez-vous
2. Choisir patient **Dupont Marie**, spécialité **Cardiologie**, médecin **Martin Jean**
3. Date future + motif → confirmer
4. Vérifier le RDV dans `/mes-rendez-vous` (UC2)
