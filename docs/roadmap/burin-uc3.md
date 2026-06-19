# Roadmap — Burin (UC3)

| | |
|---|---|
| **Responsable** | Burin |
| **Cas d'utilisation** | UC3 — S'enregistrer à l'arrivée |
| **Spec** | c3.pdf |
| **Acteur** | Patient |
| **Avancement** | ~70 % |
| **Branche archivée** | — (implémenté directement sur `main`) |

[← Index roadmap](../ROADMAP.md)

---

## État actuel

### Routes & API

| Type | Chemin |
|------|--------|
| UI | `/kiosque` (plein écran, hors layout) |
| API | `PATCH /rendezvous/:id/register` |

### Règles métier backend

- RDV doit être `PLANIFIE`
- Date du RDV = aujourd'hui
- Fenêtre horaire : ±30 min (standard) ou ±15 min (créneau proche)

### Tables SQL

- `t_rendez_vous` → statut passe à `PRESENT`

### Fichiers clés

| Couche | Fichier |
|--------|---------|
| Frontend | `frontend/src/views/KiosqueView.jsx` |
| Service | `frontend/src/services/rendezvousService.js` → `registerPresence()` |
| Backend | `backend/src/controllers/rendezvousController.js` → `registerPresence` |
| Modèle | `backend/src/models/RendezVous.js` → `updatePresence()` |

---

## Ce qui fonctionne

- [x] Interface borne plein écran (fond sombre, gros chiffres)
- [x] Saisie numérique de l'`id_rdv`
- [x] Écran succès (5 s puis reset)
- [x] Message erreur → redirection guichet
- [x] Seed demo : RDV #3 = `NOW() + 15 min` (après `db:init`)
- [x] Lien UC3 → UC4 : `GET /patients/present` alimente le guichet Jess

---

## Écarts / dette connue

| Écart | Détail |
|-------|--------|
| Pas de QR code | Spec c3 prévoit scan QR — non implémenté |
| Saisie manuelle id | Patient doit connaître son numéro RDV |
| Pas de recherche | Impossible de retrouver RDV par nom/téléphone |
| Pas de badge imprimé | Aucune impression présence |

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
| **P1** | Scan QR code (encoder `id_rdv` ou token) via caméra / lecteur | L |
| **P1** | Générer QR à la confirmation UC1 ou sur UC2 | M |
| **P2** | Recherche fallback : nom + téléphone → liste RDV du jour | M |
| **P2** | Afficher nom patient + heure RDV sur écran succès | S |
| **P3** | Mode borne dédié (pas de barre navigateur, timeout inactivité) | M |
| **P3** | Impression badge « Présent » | M |

---

## Critères « terminé » (100 %)

- [ ] Enregistrement par QR sans saisie manuelle
- [ ] Fallback recherche patient si QR indisponible
- [ ] Validation horaire couverte par tests automatisés
- [ ] Chaîne UC1 → UC3 → UC4 validée en démo
- [ ] Interface utilisable sur écran tactile 10"

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
