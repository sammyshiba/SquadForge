# DESIGN — Feature 1: Project Setup & Tooling

## Purpose

Provide a monorepo scaffold with npm workspaces that supports development, building, testing, and optional database usage with a single install command.

---

## Monorepo Structure

```
/
├── package.json              # Root: defines workspaces, shared scripts
├── packages/
│   ├── frontend/             # React + Vite + Tailwind
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── vitest.config.ts
│   │   └── src/
│   └── backend/              # Express + TypeScript
│       ├── package.json
│       ├── vitest.config.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── src/
├── .nvmrc                    # Node version: 22
├── tsconfig.json             # Root TypeScript config
└── eslint.config.mjs         # Flat ESLint config
```

---

## Root package.json Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=packages/frontend\" \"npm run dev --workspace=packages/backend\"",
    "build": "npm run build --workspace=packages/frontend && npm run build --workspace=packages/backend",
    "test": "npm run test --workspace=packages/frontend && npm run test --workspace=packages/backend",
    "lint": "eslint .",
    "format:check": "prettier --check ."
  },
  "workspaces": ["packages/frontend", "packages/backend"]
}
```

---

## Node Version

- `.nvmrc`: `22`
- `package.json` engines: `"node": ">=20"`
- Support Node 20.x and 22.x LTS

---

## Database (Optional)

- SQLite via Prisma — only activated if `prisma/schema.prisma` exists and `prisma generate` is run
- NOT required for the base starter to function
- Schema location: `packages/backend/prisma/schema.prisma`

---

## Tech Alignment

- npm workspaces (not yarn/pnpm)
- TypeScript strict mode in all workspaces
- Vitest for unit tests (--run mode)
- Playwright for E2E
- ESLint flat config + Prettier
