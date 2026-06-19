# Système de Gestion Hospitalière

Monorepo segmenté en deux sous-systèmes autonomes : **backend** (API REST Express) et **frontend** (interface graphique).

> Voir [docs/BRANCH-AUDIT.md](docs/BRANCH-AUDIT.md) pour l'audit des branches et les erreurs corrigées par UC.

## Structure du projet

```
system-gestion-hospitaliere/
├── docs/
│   └── BRANCH-AUDIT.md   # Audit des branches et erreurs
├── backend/
│   ├── sql/init.sql      # Schéma PostgreSQL + données de test
│   ├── scripts/initDb.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── middlewares/
│       └── routes/
└── frontend/
    └── src/
        ├── components/
        ├── services/
        └── views/
```

## Cas d'utilisation intégrés

| UC | Route frontend | API backend |
|----|----------------|-------------|
| UC1 Prendre RDV | `/prendre-rendez-vous` | `POST /rendezvous/book` |
| UC2 Mes RDV | `/mes-rendez-vous` | `GET /patients/:id/rendezvous` |
| UC4–UC5 File / tickets | `/file-attente` | `GET /file-attente`, `POST /tickets/generate`, etc. |
| UC6 Statut ticket | `/ticket/:id/statut` | `GET /tickets/:id/status` |

## Règles de cloisonnement

- **Modèles SQL** : toute requête SQL doit être écrite dans `backend/src/models/`.
- **Vues applicatives** : les interfaces spécifiques se placent sous `frontend/src/views/`.
- **Variables locales** : le fichier `.env` ne doit jamais être poussé sur Git.

## Démarrage

### Backend

```bash
cd backend
cp .env.example .env   # renseigner vos identifiants PostgreSQL
npm install
npm run db:init        # crée les tables et données de test
npm start              # port 3000
```

### Frontend

```bash
cd frontend
cp .env.example .env   # optionnel en développement
npm install
npm start              # port 5173, proxy /api → backend
```

En **production**, définir `VITE_API_URL` vers l'URL complète du backend (ex. `https://api.mon-hopital.fr`). En développement, le proxy Vite redirige `/api` vers `http://localhost:3000`.

## Branches Git

Toutes les branches remote sont disponibles localement. Ne fusionnez **pas** directement les branches `feature/uc2-*`, `feature/uc4-*`, `feature/uc6-*` — elles sont des réécritures parallèles. Utilisez `main` comme référence intégrée.
