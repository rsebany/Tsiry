# Roadmap — Steaven (UC6)

| | |
|---|---|
| **Responsable** | Steaven |
| **Cas d'utilisation** | UC6 — Notifier patient |
| **Spec** | — (module statut ticket, branche `feature/uc6-steaven`) |
| **Acteur** | Patient (inclus dans UC4 via `<<include>>`) |
| **Avancement** | ~65 % |
| **Branche archivée** | `feature/uc6-steaven` (partiel, porté sur `main`) |

[← Index roadmap](../ROADMAP.md)

---

## État actuel

### Routes & API

| Type | Chemin |
|------|--------|
| UI | `/ticket/:id/statut` |
| API | `GET /tickets/:id/status` |

### Réponse API (extrait)

- `numero`, `statut`, `personnes_avant`, `estimation_minutes`, `message`
- Position calculée avec tri priorité urgences (UC8)

### Fichiers clés

| Couche | Fichier |
|--------|---------|
| Frontend | `frontend/src/views/TicketStatusView.jsx` |
| Frontend | `frontend/src/components/TicketThermique.jsx` (lien vers statut) |
| Service | `frontend/src/services/ticketService.js` → `getTicketStatus()` |
| Backend | `backend/src/controllers/ticketController.js` → `getTicketStatus` |
| Modèle | `backend/src/models/Ticket.js` → `getTicketStatus()` |

---

## Ce qui fonctionne

- [x] Route dynamique `/ticket/:id/statut`
- [x] Affichage numéro, statut, message position + estimation
- [x] Rafraîchissement auto toutes les 10 s
- [x] Lien depuis ticket thermique UC4/5
- [x] Tous les appels via proxy Vite (`/api`)
- [x] Estimation tenant compte de la priorité urgences

---

## Écarts / dette connue

| Écart | Détail |
|-------|--------|
| Notification passive | Patient doit ouvrir la page — pas de push/SMS |
| `numero_box` non affiché | Champ renvoyé par API mais absent de l'UI |
| Priorité urgence | Badge non affiché sur l'écran statut |
| Polling 10 s | Latence perceptible vs temps réel |

---

## Dépendances

| Sens | UC | Lien |
|------|-----|------|
| **Amont** | UC4/5 (Jess) | Ticket créé au guichet |
| **Amont** | UC8 (Orneda) | Priorité influence la position |
| **Aval** | UC10 (Clova) | Quand appelé, statut → `EN_CONSULTATION` + box |

---

## Roadmap — prochaines étapes

| Priorité | Tâche | Effort |
|----------|-------|--------|
| **P1** | Afficher `numero_box` quand statut = `EN_CONSULTATION` | S |
| **P1** | Badge priorité urgence sur l'écran statut | S |
| **P2** | Notification browser (Notification API) quand statut passe à `EN_COURS` / `EN_CONSULTATION` | M |
| **P2** | SMS / email « Votre tour approche » (vrai UC6 notifier) | L |
| **P3** | SSE ou WebSocket pour mise à jour instantanée (remplacer polling) | M |
| **P3** | QR code sur ticket thermique → ouvre directement `/ticket/:id/statut` | M |

---

## Critères « terminé » (100 %)

- [ ] Patient informé proactivement (push ou SMS) à l'appel
- [ ] Affichage box + priorité sur l'écran statut
- [ ] Mise à jour quasi temps réel (< 2 s)
- [ ] UC6 `<<include>>` UC4 validé dans le diagramme UC
- [ ] Tests sur `GET /tickets/:id/status` (positions, edge cases)

---

## Test rapide

```bash
cd backend && npm start
cd frontend && npm start
```

1. Distribuer un ticket via `/file-attente`
2. Ouvrir http://localhost:5173/ticket/1/statut (adapter l'id)
3. Appeler le patient depuis le guichet → vérifier mise à jour du statut après ~10 s
4. Optionnel : appeler en box via `/medecin/appel` → vérifier statut `EN_CONSULTATION`
