# Tsiry — Hospital Management System

Full-stack hospital queue and appointment management platform built with **Express**, **PostgreSQL**, **React**, and **Tailwind CSS**. Fully translated into Malagasy.

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, JWT auth, bcryptjs
- **Frontend**: React 19, Vite, Tailwind CSS, React Router, Axios, Leaflet (maps)
- **Testing**: Node.js built-in test runner

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
cp .env.example .env      # set DB_PASSWORD and JWT_SECRET
npm install
npm run db:init           # create schema
npm run db:seed           # populate demo data
npm start                 # http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173 (proxies /api → backend)
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
  vite.config.js        # Dev proxy /api → :3000
```

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm start` | backend | Start API server |
| `npm run db:init` | backend | Apply schema |
| `npm run db:seed` | backend | Insert demo data |
| `npm run dev` | frontend | Start Vite dev server |
| `npm run build` | frontend | Production build |
