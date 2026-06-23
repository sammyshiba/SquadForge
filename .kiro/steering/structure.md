# Project Structure

## Specification References

#[[file:docs/requirements.md]]
#[[file:docs/architecture.md]]
#[[file:docs/api-spec.md]]
#[[file:docs/ui-spec.md]]
#[[file:docs/test-cases.md]]

---

This is an npm workspaces monorepo. All new files MUST be placed according to this structure.

```
/
├── package.json                  # Root workspace config
├── tsconfig.json                 # Shared TypeScript settings
├── eslint.config.mjs             # ESLint flat config
├── .prettierrc.json              # Prettier config
├── .kiro/
│   ├── steering/                 # AI agent steering files
│   │   ├── product.md
│   │   ├── tech.md
│   │   ├── structure.md
│   │   └── conventions.md
│   ├── hooks/                    # Agent hooks
│   └── specs/                    # Feature specs
├── docs/                         # Project documentation
│   ├── requirements.md
│   ├── architecture.md
│   ├── api-spec.md
│   ├── ui-spec.md
│   └── test-cases.md
├── client/                       # React + Vite SPA
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── playwright.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── e2e/                      # Playwright E2E tests
│   │   └── *.spec.ts
│   ├── tests/                    # Vitest component tests
│   │   ├── setup.ts
│   │   └── *.test.tsx
│   └── src/
│       ├── main.tsx              # App entry point
│       ├── App.tsx               # Root component with router
│       ├── index.css             # Tailwind directives
│       ├── api/                  # API client functions
│       │   └── client.ts         # Fetch wrapper for backend calls
│       ├── components/           # Reusable UI components
│       │   ├── CandidateCard.tsx
│       │   ├── CandidateBreakdown.tsx
│       │   ├── AvailabilityBadge.tsx
│       │   ├── SuitabilityScore.tsx
│       │   ├── ScoreBar.tsx
│       │   ├── SkillChip.tsx
│       │   ├── ProposedSquadBar.tsx
│       │   └── FilterBar.tsx
│       ├── pages/                # Route-level page components
│       │   ├── DemandCenter.tsx
│       │   ├── CandidateList.tsx
│       │   └── SquadSummary.tsx
│       ├── hooks/                # Custom React hooks
│       │   ├── useSquadForge.ts
│       │   └── useDemandForm.ts
│       ├── context/              # React Context providers
│       │   └── SquadContext.tsx
│       ├── types/                # Frontend-specific types
│       │   └── index.ts
│       └── utils/                # UI helper functions
│           ├── generate-reason.ts
│           └── export-squad.ts
├── server/                       # Express API server
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── migrations/           # Prisma migrations
│   │   └── seed.ts               # Mock data seeder
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── routes/               # Express route handlers
│   │   │   ├── health.ts         # GET /health, GET /api/health
│   │   │   ├── info.ts           # GET /api/info
│   │   │   ├── echo.ts           # POST /api/echo
│   │   │   ├── demand.ts         # POST /api/demands
│   │   │   ├── candidates.ts     # GET /api/employees
│   │   │   └── squads.ts         # POST /api/squads, members, status
│   │   ├── services/             # Business logic layer
│   │   │   ├── scoring-service.ts
│   │   │   └── scoring.config.ts
│   │   ├── middleware/           # Express middleware
│   │   │   ├── error-handler.ts
│   │   │   └── validation.ts
│   │   ├── types/                # Backend-specific types
│   │   │   └── index.ts
│   │   └── utils/                # Backend helper functions
│   └── tests/
│       └── *.test.ts             # Vitest unit tests
└── shared/                       # Shared types and constants (optional)
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── types.ts
        └── constants.ts
```

## Placement Rules

- **New API endpoints** → `server/src/routes/`
- **New business logic** → `server/src/services/`
- **New UI components** → `client/src/components/`
- **New pages/views** → `client/src/pages/`
- **New API client calls** → `client/src/api/`
- **Shared domain types** → `shared/src/types.ts`
- **Mock/seed data** → `server/prisma/seed.ts`
- **E2E tests** → `client/e2e/`
- **Unit tests** → Co-located with source as `*.test.ts` or in `tests/` directory

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
