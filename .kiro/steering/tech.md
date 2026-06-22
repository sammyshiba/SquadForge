# Tech Stack

All code generation and architectural decisions MUST use the following stack. Do not introduce alternative libraries or frameworks.

## Language

- TypeScript in strict mode (`"strict": true` in tsconfig.json)
- All files use `.ts` or `.tsx` extensions — never plain JavaScript

## Frontend

- **Framework:** React 18+
- **Build tool:** Vite
- **Styling:** Tailwind CSS (utility-first, no CSS modules or styled-components)
- **Routing:** React Router (if routing is needed)
- When generating components, use functional components with hooks. No class components.

## Backend

- **Runtime:** Node.js
- **Framework:** Express
- **API style:** RESTful JSON endpoints
- All route handlers must be typed. Use typed request/response generics from Express.

## Database

- **Engine:** SQLite
- **ORM:** Prisma
- Schema lives in `backend/prisma/schema.prisma`
- Use Prisma Client for all database access — no raw SQL unless absolutely necessary
- Migrations managed via `npx prisma migrate dev`

## Testing

- **Unit tests:** Vitest (use `describe`, `it`, `expect` — no Jest)
- **E2E tests:** Playwright
- Test files live alongside source using `*.test.ts` or `*.spec.ts` naming
- Run unit tests with `npm run test` (uses Vitest with `--run` flag, not watch mode)

## Package Management & Project Structure

- **Package manager:** npm (do not use yarn or pnpm)
- **Monorepo structure:** npm workspaces
  - `packages/frontend/` — React + Vite app
  - `packages/backend/` — Express API server
- Root `package.json` defines workspaces
- Shared types can live in a `packages/shared/` workspace if needed

## Key Commands

```bash
# Install all dependencies
npm install

# Run frontend dev server
npm run dev --workspace=packages/frontend

# Run backend dev server
npm run dev --workspace=packages/backend

# Run unit tests
npm run test --workspace=packages/frontend
npm run test --workspace=packages/backend

# Run E2E tests
npx playwright test

# Generate Prisma client after schema changes
npx prisma generate --schema=packages/backend/prisma/schema.prisma

# Run database migrations
npx prisma migrate dev --schema=packages/backend/prisma/schema.prisma
```

## Constraints

- Do NOT add AI/ML libraries — scoring logic must be rules-based
- Do NOT add ORMs other than Prisma
- Do NOT use CSS-in-JS solutions — use Tailwind only
- Do NOT introduce server-side rendering — this is a Vite SPA + Express API setup
- Keep dependencies minimal; prefer built-in Node.js APIs where sufficient
