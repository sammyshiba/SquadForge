# ARCHITECTURE — SquadForge

## Overview

SquadForge is a Vite SPA + Express API prototype. No SSR, no microservices — a straightforward monorepo with a React frontend calling a RESTful Express backend backed by SQLite via Prisma.

---

## System Diagram

```
┌──────────────────┐       ┌──────────────────┐       ┌───────────┐
│   Frontend       │       │   Backend        │       │  Database │
│   React + Vite   │──────▶│   Express + TS   │──────▶│  SQLite   │
│   (SPA)          │  HTTP │   (REST API)     │ Prisma│  (file)   │
│   port 5173      │       │   port 3001      │       │           │
└──────────────────┘       └──────────────────┘       └───────────┘
        │                          │
        │ Tailwind CSS             │ Zod validation
        │ React Router             │ Rules-based scoring
        │ Context + useReducer     │ Global error handler
```

---

## Monorepo Structure

```
/
├── packages/frontend/    ← React + Vite + Tailwind SPA
├── packages/backend/     ← Express + Prisma + SQLite API
├── packages/shared/      ← (optional) shared TypeScript types
├── docs/                 ← specifications and documentation
└── .kiro/                ← agent steering, specs, hooks
```

Managed via npm workspaces. Single `npm install` at root.

---

## Data Model

### Employee (mock data — seeded, not user-created)

| Field                        | Type     | Notes                              |
|------------------------------|----------|------------------------------------|
| id                           | string   | PK, "EMP-001" format              |
| name                         | string   | Full name                          |
| primaryRole                  | string   | Single role label                  |
| skills                       | json     | Array of `{ name, level (1-5) }`  |
| currentAllocationPercentage  | number   | 0–100                             |
| availabilityLabel            | string   | Derived from allocation            |
| businessDomain               | string   | e.g. "Retail Banking"             |

### DeliveryRequest (user-submitted)

| Field                | Type     | Notes                              |
|----------------------|----------|------------------------------------|
| id                   | string   | PK, UUID                          |
| squadIntent          | string   | Free text                          |
| projectCode          | string   | Format: ZAF-YYYY-NNN              |
| priorityLevel        | string   | urgent-regulatory/high/medium/low  |
| requiredRole         | string   | Role to match                      |
| requiredSkills       | json     | Array of skill name strings        |
| expectedDurationWeeks| number   | > 0                                |
| businessDomain       | string   | Domain filter                      |
| createdAt            | datetime | Auto                               |

### Squad (user-assembled)

| Field         | Type     | Notes                              |
|---------------|----------|------------------------------------|
| id            | string   | PK, UUID                          |
| demandId      | string   | FK → DeliveryRequest              |
| memberIds     | json     | Array of employee IDs              |
| status        | string   | "draft" / "finalized"             |
| createdAt     | datetime | Auto                               |
| updatedAt     | datetime | Auto                               |

### Relationships

- DeliveryRequest 1──▶ 1 Squad (one squad per request)
- Squad N──▶ N Employee (via memberIds array)

---

## Key Design Decisions

| Decision              | Choice          | Rationale                                        |
|-----------------------|-----------------|--------------------------------------------------|
| Architecture          | Monolith (SPA + API) | Prototype scope, fast iteration             |
| Database              | SQLite          | Zero setup, file-based, sufficient for mock data |
| ORM                   | Prisma          | Type-safe queries, migration support             |
| API style             | REST + JSON     | Simple, team familiarity                         |
| Scoring               | Rules-based arithmetic | Deterministic, testable, no AI/ML deps   |
| Styling               | Tailwind CSS    | Utility-first, fast prototyping                  |
| State management      | React Context   | Minimal deps, sufficient for single-page scope   |
| Auth                  | None            | Prototype — no auth required                     |
| Hosting               | Local only      | No deployment target for prototype phase         |

---

## API Architecture

```
Express App
├── Middleware: cors(), json(), errorHandler
├── Routes:
│   ├── GET  /health
│   ├── GET  /api/health
│   ├── GET  /api/info
│   ├── POST /api/echo
│   ├── POST /api/workspace/demand
│   ├── GET  /api/workspace/:demandId/candidates
│   ├── GET  /api/workspace/:demandId/candidates/:id/breakdown
│   ├── POST /api/squad
│   ├── POST /api/squad/:id/members
│   ├── DELETE /api/squad/:id/members/:candidateId
│   ├── POST /api/squad/:id/finalize
│   ├── POST /api/squad/:id/reset
│   └── GET  /api/squad/:id/export
└── Services:
    └── scoring-service.ts (pure functions, no side effects)
```

---

## Scoring Engine Architecture

All scoring is performed by pure functions in `packages/backend/src/services/scoring-service.ts`.

```
Input: DemandCriteria + CandidateProfile[]
  │
  ├─ calculateSkillScore()     → 0-100
  ├─ calculateAvailabilityScore() → 0, 20, 70, or 100
  ├─ calculateRoleScore()      → 0 or 100
  │
  └─ calculateTotalScore()
       S_Total = (0.50 × S_Skill) + (0.30 × S_Avail) + (0.20 × S_Role)
  │
  └─ rankCandidates() → ScoredCandidate[] (sorted desc)
```

**Constraint:** No AI/ML. No external APIs. Mock data only.

---

## Frontend Architecture

```
React App (SPA, Vite)
├── Pages (route-level)
│   ├── ResourceQueue.tsx     — main page: form + recommendations + squad bar
│   └── (future: SquadConfirmation.tsx)
├── Components (reusable)
│   ├── DemandCaptureForm.tsx
│   ├── RecommendationQueue.tsx
│   ├── CandidateCard.tsx
│   ├── CandidateBreakdown.tsx
│   ├── ProposedSquadBar.tsx
│   └── ...utility components
├── Context
│   └── SquadContext.tsx      — shared squad state (useReducer)
├── Hooks
│   └── useDemandForm.ts     — form state + validation
└── Utils
    ├── generate-reason.ts   — rule-based explanation text
    └── export-squad.ts      — JSON export helper
```

---

## Constraints

- NO server-side rendering
- NO external integrations (HR, calendar, identity)
- NO AI/ML libraries
- NO additional ORMs
- NO CSS-in-JS
- Minimal dependencies — prefer built-in Node.js APIs
