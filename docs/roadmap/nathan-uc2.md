# Roadmap — Nathan (UC2)

| | |
|---|---|
| **Responsable** | Nathan |
| **Cas d'utilisation** | UC2 — Consulter rendez-vous |
| **Spec** | c2.pdf |
| **Acteur** | Patient |
| **Avancement** | ~90 % |
| **Branche archivée** | `feature/uc2-nathan` (UC2 porté additivement sur `main`) |

[← Index roadmap](../ROADMAP.md)

---

## État actuel

### Routes & API

| Type | Chemin |
|------|--------|
| UI | `/mes-rendez-vous` |
| API | `GET /patients/:id/rendezvous` |

### Tables SQL

- `t_rendez_vous` (lecture par `id_patient`)
- `t_utilisateur` (jointure médecin : nom, prénom, spécialité)

### Fichiers clés

| Couche | Fichier |
|--------|---------|
| Frontend | `frontend/src/views/MesRendezVousView.jsx` |
| Utilitaires | `frontend/src/services/rendezvousUtils.js` (badges statut) |
| Service | `frontend/src/services/rendezvousService.js` |
| Backend | `backend/src/controllers/rendezvousController.js` |
| Modèle | `backend/src/models/RendezVous.js` → `findByPatient()` |

---

## Ce qui fonctionne

- [x] Titre « Mon Espace Santé »
- [x] Liste des RDV du patient demo (id **1**)
- [x] Affichage date, motif, médecin, spécialité
- [x] Badges colorés par statut (`PLANIFIE`, `PRESENT`, etc.)
- [x] État vide si aucun RDV
- [x] Gestion erreur réseau

---

## Écarts / dette connue

| Écart | Détail |
|-------|--------|
| ID patient hardcodé | `DEMO_PATIENT_ID = 1` dans `MesRendezVousView.jsx` |
| Pas de filtres | Tous les RDV mélangés (passés / futurs) |
| Pas de lien kiosk | Aucun raccourci « m'enregistrer » vers `/kiosque` |
| Branche feature | `feature/uc2-nathan` contenait des réécritures incompatibles — ne pas merger |

---

## Dépendances

| Sens | UC | Lien |
|------|-----|------|
| **Amont** | UC1 (Romualdo) | Les RDV affichés sont créés via la réservation |
| **Aval** | UC3 (Burin) | Patient utilise l'`id_rdv` affiché pour le kiosk |

---

## Roadmap — prochaines étapes

| Priorité | Tâche | Effort |
|----------|-------|--------|
| **P1** | Remplacer `DEMO_PATIENT_ID` par session patient (auth ou contexte) | M |
| **P2** | Filtres : onglets « À venir » / « Passés » / « Tous » | S |
| **P2** | Carte RDV du jour avec bouton « Aller au kiosk » si `PLANIFIE` + date = aujourd'hui | S |
| **P2** | Afficher le numéro RDV (`id_rdv`) visible pour le kiosk | S |
| **P3** | Export PDF de l'historique | M |
| **P3** | Rappels / notifications avant RDV | L |

---

## Critères « terminé » (100 %)

- [ ] Patient connecté voit uniquement ses propres RDV
- [ ] Filtres temporels fonctionnels
- [ ] Lien direct vers UC3 pour RDV du jour
- [ ] Statuts synchronisés avec UC3 (`PRESENT` après enregistrement)
- [ ] Tests sur `GET /patients/:id/rendezvous`

---

## Test rapide

```bash
cd backend && npm start
cd frontend && npm start
```

1. Créer un RDV via UC1 (`/prendre-rendez-vous`)
2. Ouvrir http://localhost:5173/mes-rendez-vous
3. Vérifier que le nouveau RDV apparaît avec badge `PLANIFIE`
