# REQUIREMENTS — Feature 1: Project Setup & Tooling

## EARS Format

### REQ-1.1 (Ubiquitous)

> The system shall be installable as an npm workspaces monorepo with a single `npm install` at the root.

### REQ-1.2 (Event-driven)

> When a developer runs `npm run dev`, the system shall start backend and frontend dev servers with hot reload.

### REQ-1.3 (Event-driven)

> When a developer runs `npm run build`, the system shall build both workspaces for production.

### REQ-1.4 (Event-driven)

> When a developer runs `npm test`, the system shall execute all tests and return CI-friendly status codes.

### REQ-1.5 (Ubiquitous)

> The system shall require Node.js 20+ and support Node 22 LTS.

### REQ-1.6 (Optional)

> Where a database is used, the system shall support SQLite + Prisma but not require it.
