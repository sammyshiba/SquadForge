# TASKS — Feature 2: Backend API

## Task 1: Create Express App with Middleware

- **Status:** not_started
- **Refs:** REQ-2.5, REQ-2.7, REQ-2.8
- **Files:** `packages/backend/src/app.ts`, `packages/backend/src/index.ts`
- **Description:** Create Express app with CORS and JSON parsing middleware. Entry point reads PORT from env (default 3001) and starts server. Separate app setup from server start for testability.

## Task 2: Implement Health Endpoints

- **Status:** not_started
- **Refs:** REQ-2.1, REQ-2.2
- **Files:** `packages/backend/src/routes/health.ts`
- **Description:** Create `GET /health` (status + timestamp) and `GET /api/health` (status + timestamp + uptime via `process.uptime()`). Use `{ data }` envelope.

## Task 3: Implement Info Endpoint

- **Status:** not_started
- **Refs:** REQ-2.3
- **Files:** `packages/backend/src/routes/info.ts`
- **Description:** Create `GET /api/info` returning name ("squadforge-api"), version (from package.json), and environment (from NODE_ENV, default "development"). Use `{ data }` envelope.

## Task 4: Implement Echo Endpoint

- **Status:** not_started
- **Refs:** REQ-2.4
- **Files:** `packages/backend/src/routes/echo.ts`
- **Description:** Create `POST /api/echo` that returns the request body as `echo` field plus a `timestamp`. Use `{ data }` envelope. Must not crash on empty/invalid body.

## Task 5: Create Global Error Handler

- **Status:** not_started
- **Refs:** REQ-2.6
- **Files:** `packages/backend/src/middleware/error-handler.ts`
- **Description:** Express error middleware that catches all uncaught errors. Returns `{ error: { code, message } }` with appropriate HTTP status. Never exposes stack traces in production.

## Task 6: Unit Tests for All Endpoints

- **Status:** not_started
- **Refs:** REQ-2.1 through REQ-2.8
- **Files:** `packages/backend/src/routes/health.test.ts`, `packages/backend/src/routes/info.test.ts`, `packages/backend/src/routes/echo.test.ts`
- **Description:** Vitest tests using supertest. Test: health returns 200 + correct shape, info returns correct fields, echo returns payload, error handler returns structured error. Minimum 8 test cases.
