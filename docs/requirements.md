# Requirements — Node Conf Starter

> **Author role:** Business Analyst (BA)
> **Format:** EARS (Easy Approach to Requirements Syntax)
> **Status:** Baseline (reflects the shipped starter template)

EARS keywords used below:

- **Ubiquitous** — "The `<system>` shall `<response>`."
- **Event-driven** — "When `<trigger>`, the `<system>` shall `<response>`."
- **State-driven** — "While `<state>`, the `<system>` shall `<response>`."
- **Unwanted behaviour** — "If `<condition>`, then the `<system>` shall `<response>`."
- **Optional** — "Where `<feature>`, the `<system>` shall `<response>`."

---


## 1. Project Setup & Tooling

- **REQ-1.1** (Ubiquitous) The repository shall be installable as an npm workspaces monorepo with a single `npm install` at the root, setting up both the `server` and `client` workspaces.
- **REQ-1.2** (Event-driven) When a developer runs `npm run dev` at the repo root, the system shall start the backend and frontend dev servers together with hot reload.
- **REQ-1.3** (Event-driven) When a developer runs `npm run build`, the system shall type-check and build both workspaces for production.
- **REQ-1.4** (Event-driven) When a developer runs `npm test`, the system shall execute all unit and component tests once and exit with a CI-friendly status code.
- **REQ-1.5** (Ubiquitous) The system shall require Node.js 20 or newer and pin Node 22 LTS via `.nvmrc`.
- **REQ-1.6** (Optional) Where a developer chooses to use a database, the system shall provide SQLite + Prisma preconfigured but shall not require it to run the app.

## 2. Backend API

- **REQ-2.1** (Event-driven) When a client sends `GET /health`, the server shall respond with HTTP 200 and a JSON body containing a status indicator and an ISO-8601 timestamp.
- **REQ-2.2** (Event-driven) When a client sends `GET /api/health`, the server shall respond with HTTP 200 and a JSON body containing a health status, an ISO-8601 timestamp, and the process uptime in seconds.
- **REQ-2.3** (Event-driven) When a client sends `GET /api/info`, the server shall respond with HTTP 200 and a JSON body containing the API name, version, and current environment.
- **REQ-2.4** (Event-driven) When a client sends `POST /api/echo` with a JSON body, the server shall respond with HTTP 200 echoing the received body together with an ISO-8601 receipt timestamp.
- **REQ-2.5** (Ubiquitous) The server shall accept cross-origin requests via CORS and parse incoming `application/json` request bodies.
- **REQ-2.6** (Unwanted behaviour) If an unhandled error occurs while processing a request, then the server shall route it through the error-handling middleware and return a structured error response rather than crashing.
- **REQ-2.7** (State-driven) While no `PORT` environment variable is set, the server shall listen on port 3001.
- **REQ-2.8** (Optional) Where a `PORT` environment variable is provided, the server shall listen on that port instead.

## 3. Frontend Application

- **REQ-3.1** (Event-driven) When the application first mounts, the client shall request `GET /api/health` and display the returned backend status.
- **REQ-3.2** (Unwanted behaviour) If the health request fails, then the client shall display the status as `error` instead of leaving it pending.
- **REQ-3.3** (State-driven) While the health request is in flight, the client shall display the status as `loading...`.
- **REQ-3.4** (Event-driven) When the user clicks the Increment button, the client shall increase the displayed counter by one.
- **REQ-3.5** (Ubiquitous) The client shall be served by the Vite dev server on port 5173 and shall proxy `/api/*` requests to the backend.

## 4. Quality & Verification

- **REQ-4.1** (Event-driven) When a developer runs `npm run lint`, the system shall lint all code with ESLint and report violations.
- **REQ-4.2** (Event-driven) When a developer runs `npm run format:check`, the system shall verify formatting with Prettier without modifying files.
- **REQ-4.3** (Event-driven) When a developer runs `npm run test:e2e` after installing Playwright browsers, the system shall run end-to-end tests, automatically starting the client dev server.
 