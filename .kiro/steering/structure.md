# Project Structure

This is an npm workspaces monorepo. All new files MUST be placed according to this structure.

```
/
├── package.json                  # Root workspace config
├── tsconfig.base.json            # Shared TypeScript settings
├── playwright.config.ts          # E2E test configuration
├── .kiro/
│   └── steering/                 # AI agent steering files
│       ├── product.md
│       ├── tech.md
│       ├── structure.md
│       └── conventions.md
├── docs/                         # Project documentation
│   ├── requirements.md
│   ├── architecture.md
│   ├── api-spec.md
│   ├── ui-spec.md
│   └── test-cases.md
├── packages/
│   ├── frontend/                 # React + Vite SPA
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── index.html
│   │   ├── public/
│   │   └── src/
│   │       ├── main.tsx          # App entry point
│   │       ├── App.tsx           # Root component with router
│   │       ├── api/              # API client functions
│   │       │   └── client.ts     # Fetch wrapper for backend calls
│   │       ├── components/       # Reusable UI components
│   │       │   ├── CandidateCard.tsx
│   │       │   ├── CandidateBreakdown.tsx
│   │       │   ├── AvailabilityBadge.tsx
│   │       │   ├── SuitabilityScore.tsx
│   │       │   ├── ScoreBar.tsx
│   │       │   ├── SkillChip.tsx
│   │       │   ├── ProposedSquadBar.tsx
│   │       │   └── FilterBar.tsx
│   │       ├── pages/            # Route-level page components
│   │       │   ├── DemandCenter.tsx      # Capture delivery need
│   │       │   ├── CandidateList.tsx     # Ranked shortlist results
│   │       │   └── SquadSummary.tsx      # Review and confirm squad
│   │       ├── hooks/            # Custom React hooks
│   │       │   ├── useSquadForge.ts
│   │       │   └── useDemandForm.ts
│   │       ├── context/          # React Context providers
│   │       │   └── SquadContext.tsx
│   │       ├── types/            # Frontend-specific types
│   │       │   └── index.ts
│   │       └── utils/            # UI helper functions
│   │           ├── generate-reason.ts
│   │           └── export-squad.ts
│   ├── backend/                  # Express API server
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Database schema
│   │   │   ├── migrations/      # Prisma migrations
│   │   │   └── seed.ts          # Mock data seeder
│   │   └── src/
│   │       ├── index.ts          # Server entry point
│   │       ├── routes/           # Express route handlers
│   │       │   ├── health.ts     # GET /health, GET /api/health
│   │       │   ├── info.ts       # GET /api/info
│   │       │   ├── echo.ts       # POST /api/echo
│   │       │   ├── demand.ts     # POST /api/workspace/demand
│   │       │   ├── candidates.ts # GET /api/workspace/:demandId/candidates
│   │       │   └── squads.ts     # POST /api/squad, finalize, reset, export
│   │       ├── services/         # Business logic layer
│   │       │   └── scoring-service.ts  # Rules-based candidate scoring + ranking
│   │       ├── middleware/       # Express middleware
│   │       │   ├── errorHandler.ts
│   │       │   └── validation.ts
│   │       ├── types/            # Backend-specific types
│   │       │   └── index.ts
│   │       └── utils/            # Backend helper functions
│   └── shared/                   # Shared types and constants (optional)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── types.ts          # Shared domain types (Employee, Skill, Request, etc.)
│           └── constants.ts      # Shared enums and constants
└── tests/
    └── e2e/                      # Playwright E2E tests
        ├── request-flow.spec.ts  # Full journey: create request → view shortlist → form squad
        └── fixtures/             # Test data fixtures
```

## Placement Rules

- **New API endpoints** → `packages/backend/src/routes/`
- **New business logic** → `packages/backend/src/services/`
- **New UI components** → `packages/frontend/src/components/`
- **New pages/views** → `packages/frontend/src/pages/`
- **New API client calls** → `packages/frontend/src/api/`
- **Shared domain types** → `packages/shared/src/types.ts`
- **Mock/seed data** → `packages/backend/prisma/seed.ts`
- **E2E tests** → `tests/e2e/`
- **Unit tests** → Co-located with source as `*.test.ts`

## Key Domain Entities

These are the core data models for the squad assembly use case:

- **Employee** — Internal team member with skills, role, and availability
- **Skill** — A capability (e.g., "architecture", "React", "testing")
- **DeliveryRequest** — A work request specifying required skills, urgency, and duration
- **Candidate** — An employee scored and ranked against a specific request
- **Squad** — A confirmed group of selected candidates for a delivery request

## Naming Conventions

- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for React components
- Directories: `kebab-case/`
- Database tables: `snake_case` (Prisma convention)
- API routes: `kebab-case` (e.g., `/api/delivery-requests`)
- Types/interfaces: `PascalCase`
