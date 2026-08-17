# Tsiry

Hospital queue and appointment management system for Malagasy healthcare facilities

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4.svg)](https://tailwindcss.com/)

Fully translated into Malagasy with a kiosk-based patient registration workflow, real-time public monitor, and triage scoring.


## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:init
npm run db:seed
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@tsiry.mg` | `admin123` |
| Patient | `nomena.rasoa@demo.mg` | `demo123` |
| Agent | `feno.razafi@demo.mg` | `demo123` |
| Doctor | `hery.rakoto@demo.mg` | `demo123` |

Public routes (`/kiosque`, `/moniteur`, `/carte`) work without login.

## Features

- **Kiosk** — Patient self-registration, ticket generation
- **Agent Dashboard** — Queue management, ticket calling, reprinting
- **Doctor Dashboard** — Patient queue, consultation view, vitals, history
- **Public Monitor** — Live queue display for waiting rooms
- **Admin Portal** — User management, hospital CRUD, activity logs
- **Map** — Hospital locator with Leaflet
- **Appointments** — Booking and tracking
- **Urgency** — Triage scoring, priority-based queue ordering

## Project Structure

```
backend/
  src/
    controllers/        # Route handlers
    middlewares/        # Auth, role checks, error handling
    routes/             # Express routers
    db.js               # PostgreSQL pool
  scripts/              # Seed, DB init
  sql/                  # Schema
  tests/                # API tests

frontend/
  src/
    features/           # Domain modules (admin, agent, carte, kiosque, medecin, moniteur, patient)
    components/         # Shared UI components
    services/           # API clients
    hooks/              # Shared hooks
    lib/                # Utilities, constants
  vite.config.js        # Dev proxy /api to :3000
```

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm start` | backend | Start API server |
| `npm run db:init` | backend | Apply schema |
| `npm run db:seed` | backend | Insert demo data |
| `npm run dev` | frontend | Start Vite dev server |
| `npm run build` | frontend | Production build |
