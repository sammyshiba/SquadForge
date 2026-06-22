# Combined Requirements (Node + SquadForge)

**Author role:** Business Analyst (BA)  
**Format:** EARS (Easy Approach to Requirements Syntax)  
**Status:** Baseline (reflects the shipped starter template)

## EARS Keywords Used

- **Ubiquitous** — "The <system> shall <response>."
- **Event-driven** — "When <trigger>, the <system> shall <response>."
- **State-driven** — "While <state>, the <system> shall <response>."
- **Unwanted behaviour** — "If <condition>, then the <system> shall <response>."
- **Optional** — "Where <feature>, the <system> shall <response>."

---

# Feature 1: Project Setup & Tooling

### REQ-1.1 (Ubiquitous)
The system shall be installable as an npm workspaces monorepo with a single `npm install` at the root.

### REQ-1.2 (Event-driven)
When a developer runs `npm run dev`, the system shall start backend and frontend dev servers with hot reload.

### REQ-1.3 (Event-driven)
When a developer runs `npm run build`, the system shall build both workspaces for production.

### REQ-1.4 (Event-driven)
When a developer runs `npm test`, the system shall execute all tests and return CI-friendly status codes.

### REQ-1.5 (Ubiquitous)
The system shall require Node.js 20+ and support Node 22 LTS.

### REQ-1.6 (Optional)
Where a database is used, the system shall support SQLite + Prisma but not require it.

---

# Feature 2: Backend API

### REQ-2.1 (Event-driven)
When a client sends `GET /health`, the server shall return HTTP 200 with status and timestamp.

### REQ-2.2 (Event-driven)
When a client sends `GET /api/health`, the server shall return health status, timestamp, and uptime.

### REQ-2.3 (Event-driven)
When a client sends `GET /api/info`, the server shall return API name, version, and environment.

### REQ-2.4 (Event-driven)
When a client sends `POST /api/echo`, the server shall return the same payload with a timestamp.

### REQ-2.5 (Ubiquitous)
The server shall support CORS and JSON request parsing.

### REQ-2.6 (Unwanted behaviour)
If an error occurs, the server shall return structured error responses instead of crashing.

### REQ-2.7 (State-driven)
While no `PORT` is set, the server shall run on port 3001.

### REQ-2.8 (Optional)
Where a `PORT` is provided, the server shall use that port.

---

# Feature 3: Frontend Application

### REQ-3.1 (Event-driven)
When the application loads, the client shall request `/api/health` and display the backend status.

### REQ-3.2 (Unwanted behaviour)
If the health request fails, the client shall show an error state.

### REQ-3.3 (State-driven)
While the request is pending, the client shall show a loading state.

### REQ-3.4 (Event-driven)
When the user clicks **Increment**, the client shall increase the counter.

### REQ-3.5 (Ubiquitous)
The client shall run on Vite and proxy `/api/*` requests.

---

# Feature 4: Quality & Verification

### REQ-4.1 (Event-driven)
When running lint, the system shall lint code using ESLint.

### REQ-4.2 (Event-driven)
When running format check, the system shall verify formatting with Prettier.

### REQ-4.3 (Event-driven)
When running end-to-end tests, the system shall execute tests using Playwright.

---

# Feature 5: Demand & Search Workspace

### REQ-5.1 (Event-driven)
When a user opens the Demand Center, the system shall display a demand capture form.

### REQ-5.2 (Event-driven)
When valid demand is submitted, the system shall execute scoring against mock candidates.

### REQ-5.3 (Event-driven)
When results are calculated, the system shall display ranked candidates within 1 second.

### REQ-5.4 (Event-driven)
When input fields are modified, the system shall recalculate and update results in real time.

### REQ-5.5 (Unwanted behaviour)
If required role is missing, the system shall display an error.

### REQ-5.6 (Unwanted behaviour)
If no skills are provided, the system shall display an error.

### REQ-5.7 (Ubiquitous)
The system shall use mock data only with no external integrations.

---

# Feature 6: Matchmaking & Scoring Engine

### REQ-6.1 (Ubiquitous)
The system shall calculate suitability using weighted scoring.

### REQ-6.2 (Ubiquitous)
The system shall calculate skill scores as an average.

### REQ-6.3 (Unwanted behaviour)
Missing skills shall result in 0 score.

### REQ-6.4 (Ubiquitous)
High skill levels shall result in maximum score.

### REQ-6.5 (Ubiquitous)
Lower skill levels shall result in reduced score.

### REQ-6.6 (Ubiquitous)
Availability shall be calculated from allocation percentage.

### REQ-6.7 (Ubiquitous)
Role alignment shall depend on exact matches.

### REQ-6.8 (Ubiquitous)
The system shall use rules-based scoring only.

---

# Feature 7: Candidate Profile Breakdown

### REQ-7.1 (Event-driven)
When candidates are displayed, the system shall show profile and score data.

### REQ-7.2 (Event-driven)
When the user expands a candidate, the system shall show score breakdown.

### REQ-7.3 (State-driven)
While breakdown is open, the system shall display scoring values.

### REQ-7.4 (Ubiquitous)
The system shall provide rule-based explanations.

### REQ-7.5 (Ubiquitous)
High allocation shall show availability constraints.

### REQ-7.6 (Ubiquitous)
The system shall display scoring visuals.

---

# Feature 8: Proposed Squad Builder

### REQ-8.1 (Event-driven)
When a user assigns a candidate, the system shall add them to the squad.

### REQ-8.2 (Unwanted behaviour)
Duplicate assignments shall be prevented.

### REQ-8.3 (State-driven)
Assigned candidates shall appear in the squad panel.

### REQ-8.4 (Event-driven)
Removing a candidate shall update the squad.

### REQ-8.5 (State-driven)
The system shall display filled seat count.

### REQ-8.6 (Event-driven)
Selecting candidates shall enable finalize and export actions.

### REQ-8.7 (Event-driven)
Finalizing shall display a summary.

### REQ-8.8 (Event-driven)
Resetting shall clear the squad.