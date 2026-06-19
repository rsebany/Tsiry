# Roadmap — Orneda (UC7 / UC8)

| | |
|---|---|
| **Responsable** | Orneda |
| **Cas d'utilisation** | UC7 — Déclarer urgence / UC8 — Prioriser urgence |
| **Spec** | c6.pdf |
| **Acteurs** | Agent d'accueil, Médecin, Patient Urgent |
| **Avancement** | ~60 % |
| **Branche archivée** | — (implémenté sur `main`) |

[← Index roadmap](../ROADMAP.md)

---

## État actuel

### Routes & API

| Type | Chemin |
|------|--------|
| UI | `/urgences/declare` |
| API | `POST /urgences/declare` |

### Payload API

```json
{
  "id_patient": 1,
  "pouls": 80,
  "tension_systolique": 120,
  "saturation_o2": 98,
  "id_medecin": 2
}
```

### Tables SQL

- `t_cas_urgence` : `niveau_priorite`, `score_gravite` (1–4), `id_medecin`, constantes vitales
- Lien indirect : `t_ticket.id_patient` → tri file par `score_gravite`

### Fichiers clés

| Couche | Fichier |
|--------|---------|
| Frontend | `frontend/src/views/UrgenceDeclareView.jsx` |
| Service | `frontend/src/services/urgenceService.js` |
| Backend | `backend/src/controllers/urgenceController.js` |
| Modèle | `backend/src/models/CasUrgence.js` |
| Tri file | `backend/src/models/Ticket.js` (JOIN + `ORDER BY score_gravite DESC`) |

---

## Ce qui fonctionne

- [x] Formulaire constantes vitales (pouls, tension, SpO₂)
- [x] Calcul automatique ROUGE → ORANGE → JAUNE → VERT
- [x] Persistance `score_gravite` + `niveau_priorite` (aligné LDM UML)
- [x] Sélecteur médecin référent optionnel
- [x] Alerte toast ROUGE/ORANGE
- [x] UC8 : priorisation file (guichet, moniteur, statut ticket)
- [x] Relation UC7 `<<include>>` UC8 respectée en code

---

## Écarts / dette connue

| Écart | Détail |
|-------|--------|
| Pas d'alerte sonore | ROUGE/ORANGE silencieux côté guichet/moniteur |
| Pas de re-priorisation live | Ticket déjà créé sans `id_patient` = pas de priorité |
| Constantes vitales en plus du LDM | LDM prévoit `score_gravite` seul — champs cliniques ajoutés pour le triage |
| Pas d'historique | Aucune vue historique des urgences |

---

## Dépendances

| Sens | UC | Lien |
|------|-----|------|
| **Amont** | UC4 (Jess) | Ticket avec `id_patient` pour appliquer la priorité |
| **Aval** | UC8 → UC4 | `<<extend>>` — file repriorisée |
| **Aval** | UC9 (Clova) | Moniteur affiche priorité |
| **Aval** | UC6 (Steaven) | Position ticket tient compte du score |

---

## Roadmap — prochaines étapes

| Priorité | Tâche | Effort |
|----------|-------|--------|
| **P1** | Alerte visuelle + sonore ROUGE/ORANGE sur guichet et `/moniteur` | M |
| **P1** | Bloquer déclaration si patient sans ticket en file (optionnel, warning) | S |
| **P2** | Re-priorisation immédiate : recalcul positions après `POST /urgences/declare` | M |
| **P2** | Endpoint `GET /urgences/patient/:id` (dernier cas du jour) | S |
| **P3** | Tableau de bord triage (file ROUGE en premier, stats du jour) | L |
| **P3** | Historique urgences par patient | M |

---

## Critères « terminé » (100 %)

- [ ] UC7 déclaration complète avec alertes multi-canal
- [ ] UC8 priorisation automatique et visible partout (guichet, moniteur, statut)
- [ ] Schéma `t_cas_urgence` conforme LDM (`score_gravite`, `id_medecin`)
- [ ] Tests calcul gravité (cas limites : SpO₂ 89, pouls 125, etc.)
- [ ] Chaîne UC7 → UC8 → UC4 validée en démo

---

## Test rapide

```bash
cd backend && npm run db:init && npm start
cd frontend && npm start
```

1. Distribuer ticket avec patient id **1** (via UC3 + guichet)
2. `/urgences/declare` → pouls **130**, SpO₂ **85** → priorité **ROUGE**, score **4**
3. `/file-attente` → vérifier badge ROUGE et remontée en tête de file
4. `/moniteur` → point rouge sur le numéro en attente
