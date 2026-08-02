# Système de Gestion Hospitalière

Monorepo : **backend** (API REST Express + PostgreSQL) et **frontend** (React + Vite + Tailwind).

> Roadmap par responsable : [docs/ROADMAP.md](docs/ROADMAP.md)

---

## Mise à jour complète de votre copie locale (100 % version actuelle)

⚠️ Cette procédure **remplace tout ce que vous avez en local** par la version de `main` sur GitHub. Vos changements locaux non poussés seront **définitivement perdus**.

Dans un terminal, à la racine du projet :

```bash
# 1. Récupérer la dernière version de GitHub
git fetch origin

# 2. Se placer sur la branche main
git checkout main

# 3. Forcer la copie locale = exactement le contenu de origin/main
git reset --hard origin/main

# 4. Supprimer les fichiers non suivis (anciens fichiers supprimés de main)
git clean -fd

# 5. Vérifier : doit afficher « rien à valider »
git status
```

Vous avez maintenant la version **exacte** de `main`. Vous ne devez **jamais** repousser les anciennes branches (`feature/uc2-*`, `feature/uc4-*`, `feature/uc6-*`, …) : seul `main` fait foi.

---

## Installation après mise à jour

### Backend

```bash
cd backend
cp .env.example .env        # renseigner DB_PASSWORD (ex. : postgres)
npm install
npm run db:init             # crée les tables et données de test
npm start                   # port 3000 (sinon : $env:PORT=3001; npm start)
```

### Frontend

```bash
cd frontend
npm install
npm start                   # port 5173, proxy /api → backend
```

---

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Patient | `marie.dupont@demo.fr` | `demo123` |
| Agent d'accueil | `agent.accueil@demo.fr` | `demo123` |
| Médecin | `jean.martin@demo.fr` | `demo123` |

Les routes publiques `/kiosque`, `/moniteur`, `/carte` fonctionnent sans connexion.
