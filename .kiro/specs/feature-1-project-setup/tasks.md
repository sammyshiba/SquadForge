# TASKS — Feature 1: Project Setup & Tooling

## Task 1: Configure Root package.json with Workspaces

- **Status:** not_started
- **Refs:** REQ-1.1
- **Files:** `package.json`
- **Description:** Define `workspaces: ["packages/frontend", "packages/backend"]`. Add shared scripts: dev (concurrently), build, test, lint, format:check. Add engines field requiring Node >=20.

## Task 2: Create Frontend Workspace Scaffold

- **Status:** not_started
- **Refs:** REQ-1.2, REQ-1.3
- **Files:** `packages/frontend/package.json`, `packages/frontend/vite.config.ts`, `packages/frontend/tsconfig.json`
- **Description:** Initialize Vite + React + TypeScript project. Add dev and build scripts. Configure proxy for `/api/*` to backend.

## Task 3: Create Backend Workspace Scaffold

- **Status:** not_started
- **Refs:** REQ-1.2, REQ-1.3
- **Files:** `packages/backend/package.json`, `packages/backend/tsconfig.json`, `packages/backend/src/index.ts`
- **Description:** Initialize Express + TypeScript project. Add dev script (tsx watch) and build script (tsc). Entry point listens on configurable PORT.

## Task 4: Configure Testing

- **Status:** not_started
- **Refs:** REQ-1.4
- **Files:** `packages/frontend/vitest.config.ts`, `packages/backend/vitest.config.ts`
- **Description:** Set up Vitest in both workspaces with `--run` flag (not watch). Ensure `npm test` at root runs both. Exit codes must be CI-friendly (0 = pass, non-zero = fail).

## Task 5: Set Node Version

- **Status:** not_started
- **Refs:** REQ-1.5
- **Files:** `.nvmrc`
- **Description:** Set `.nvmrc` to `22`. Verify engines field in root package.json.

## Task 6: Configure Optional Prisma

- **Status:** not_started
- **Refs:** REQ-1.6
- **Files:** `packages/backend/prisma/schema.prisma`
- **Description:** Add Prisma as a devDependency in backend. Create minimal schema with SQLite datasource. App must function without running `prisma generate` — Prisma is opt-in.
