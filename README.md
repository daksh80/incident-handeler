# Incident Tracker Mini App

This project is a full-stack Incident Tracker implementation with:
- Incident listing
- Server-side pagination/filter/search/sort
- Incident detail + update flow
- Create incident workflow

## Setup/Run Instructions

### Prerequisites
- Node.js 18+ (recommended)
- npm

### 1. Install frontend dependencies
```bash
npm install
```

### 2. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Run backend
```bash
npm run start:backend
```
Backend runs on `http://localhost:3000`.

### 4. Run frontend
```bash
npm run start:frontend
```
Frontend runs on `http://localhost:4200`.

### 5. Build frontend
```bash
npm run build
```

## API Overview

Base URL: `http://localhost:3000`

### Health
- `GET /health`
- Response: `{ "ok": true }`

### Incidents

1. `POST /api/incidents`
- Create a new incident with validation.
- Required fields: `title`, `service`, `severity`, `status`.

Sample body:
```json
{
  "title": "API timeout",
  "service": "Backend",
  "severity": "SEV1",
  "status": "OPEN",
  "owner": "dev@team.com",
  "summary": "Requests timing out"
}
```

2. `GET /api/incidents`
- Server-side listing with pagination/filter/search/sort.

Query params:
- `page` (number)
- `limit` (number)
- `search` (string)
- `status` (`OPEN | MITIGATED | RESOLVED`)
- `severity` (`SEV1 | SEV2 | SEV3 | SEV4`)
- `service` (string)
- `sortBy` (`createdAt | updatedAt | severity | status | title | service`)
- `order` (`asc | desc`)

3. `GET /api/incidents/:id`
- Fetch incident details by id.

4. `PATCH /api/incidents/:id`
- Update incident fields.
- Supported fields: `title`, `service`, `severity`, `status`, `owner`, `summary`.

## Design Decisions & Tradeoffs

### Design Decisions
- Angular frontend with componentized layout and parent-child data flow for list page.
- Express backend with SQLite for simple local relational persistence.
- `better-sqlite3` for fast synchronous local DB access.
- Shared UI/service helpers and constants for option/status/date consistency.
- Server-side list operations (pagination/search/filter/sort) handled in backend API.

### Tradeoffs
- SQLite chosen for simplicity over a production DB (Postgres/MySQL).
- No auth/role management included (outside assignment scope).
- Minimal test coverage currently.
- UI tuned to provided wireframes rather than full design system abstraction.

## Improvements With More Time

- Add unit/integration tests:
  - Backend API validation + query behavior tests
  - Frontend component/service tests
- Add API schema validation library (e.g., Zod/Joi) for stricter contracts.
- Add Docker setup for one-command local startup.
- Add better error handling and user feedback (toasts/retry states).
- Add optimistic updates for faster UX.
- Add accessibility pass (keyboard navigation, ARIA labels, focus states).
- Add CI pipeline (lint/build/test) for automated quality checks.

