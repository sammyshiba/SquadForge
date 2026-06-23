# Combined Requirements (Node + SquadForge)

**Author role:** Business Analyst (BA)  
**Format:** EARS (Easy Approach to Requirements Syntax)  
**Status:** Baseline (reflects the shipped starter template)
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

### REQ-5.2 (Ubiquitous)
The demand capture form shall include fields for required role, skills, project urgency, expected duration, business domain, and project code.

### REQ-5.3 (Event-driven)
When valid demand is submitted, the system shall execute scoring against mock candidates.

### REQ-5.4 (Event-driven)
When results are calculated, the system shall display ranked candidates within 1 second.

### REQ-5.5 (Event-driven)
When input fields are modified, the system shall recalculate and update results in real time.

### REQ-5.6 (Unwanted behaviour)
If required role is missing, then the system shall display a validation message.

### REQ-5.7 (Unwanted behaviour)
If no skills are provided, then the system shall display a validation message.

### REQ-5.8 (Unwanted behaviour)
If the project code is missing, then the system shall display a validation message.

### REQ-5.9 (Ubiquitous)
The system shall store active demand criteria during the user session.

### REQ-5.10 (Ubiquitous)
The system shall use mock data only with no external integrations.

---

# Feature 6: Matchmaking & Scoring Engine

### REQ-6.1 (Ubiquitous)
The system shall calculate suitability using deterministic rules-based weighted scoring.

### REQ-6.2 (Ubiquitous)
The system shall calculate the total suitability score using the formula: S_Total = (0.50 × S_Skill) + (0.30 × S_Availability) + (0.20 × S_Role).

### REQ-6.3 (Optional)
Where multiple skills are requested, the system shall calculate the Skill Match Score as an average of individual skill matches.

### REQ-6.4 (Unwanted behaviour)
If a skill is missing, then the system shall assign a score of 0 for that skill.

### REQ-6.5 (Optional)
Where a candidate has a skill level of 4 or 5, the system shall assign a maximum score for that skill.

### REQ-6.6 (Optional)
Where a candidate has a skill level below 4, the system shall assign a reduced score for that skill.

### REQ-6.7 (Optional)
Where a candidate's allocation is 0%, the system shall assign an Availability Score of 100.

### REQ-6.8 (Optional)
Where a candidate's allocation is between 1% and 50%, the system shall assign an Availability Score of 70.

### REQ-6.9 (Optional)
Where a candidate's allocation is greater than 50%, the system shall assign an Availability Score of 20.

### REQ-6.10 (Ubiquitous)
The system shall determine role alignment based on exact matches.

### REQ-6.11 (Ubiquitous)
The system shall factor project duration and urgency into candidate availability and suitability scoring.

### REQ-6.12 (Ubiquitous)
The system shall use rules-based scoring only.

---

# Feature 7: Candidate Profile Breakdown

### REQ-7.1 (Event-driven)
When candidates are displayed, the system shall show profile data and the total suitability score as a percentage.

### REQ-7.2 (Event-driven)
When the user expands a candidate, the system shall show the calculated Skill Match, Availability, and Role Alignment scores.

### REQ-7.3 (State-driven)
While breakdown is open, the system shall display the raw scoring values used in the calculation.

### REQ-7.4 (Ubiquitous)
The system shall provide rule-based explanations for each recommendation.

### REQ-7.5 (Optional)
Where a candidate is immediately available, the system shall display an "Available Now" status.

### REQ-7.6 (Optional)
Where a candidate has high allocation, the system shall display specific availability constraints.

### REQ-7.7 (Ubiquitous)
The system shall display scoring visuals for quick assessment.

---

# Feature 8: Proposed Squad Builder

### REQ-8.1 (Event-driven)
When a user assigns a candidate, the system shall add them to the proposed squad.

### REQ-8.2 (Unwanted behaviour)
If a user attempts a duplicate assignment, then the system shall prevent the action and display an error.

### REQ-8.3 (State-driven)
While a candidate is assigned, the system shall display them in a sticky footer tray workspace.

### REQ-8.4 (Event-driven)
When a user removes a candidate, the system shall update the squad and filled seat count.

### REQ-8.5 (State-driven)
While the squad builder is active, the system shall display the number of filled squad seats.

### REQ-8.6 (Event-driven)
When candidates are selected, the system shall enable finalize, reset, and export actions.

### REQ-8.7 (Event-driven)
When the user finalizes the squad, the system shall display a confirmation summary of selected members.

### REQ-8.8 (Event-driven)
When the user resets the squad, the system shall clear all candidates from the workspace.
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

### REQ-5.2 (Ubiquitous)
The demand capture form shall include fields for required role, skills, project urgency, expected duration, business domain, and project code.

### REQ-5.3 (Event-driven)
When valid demand is submitted, the system shall execute scoring against mock candidates.

### REQ-5.4 (Event-driven)
When results are calculated, the system shall display ranked candidates within 1 second.

### REQ-5.5 (Event-driven)
When input fields are modified, the system shall recalculate and update results in real time.

### REQ-5.6 (Unwanted behaviour)
If required role is missing, then the system shall display a validation message.

### REQ-5.7 (Unwanted behaviour)
If no skills are provided, then the system shall display a validation message.

### REQ-5.8 (Unwanted behaviour)
If the project code is missing, then the system shall display a validation message.

### REQ-5.9 (Ubiquitous)
The system shall store active demand criteria during the user session.

### REQ-5.10 (Ubiquitous)
The system shall use mock data only with no external integrations.

---

# Feature 6: Matchmaking & Scoring Engine

### REQ-6.1 (Ubiquitous)
The system shall calculate suitability using deterministic rules-based weighted scoring.

### REQ-6.2 (Ubiquitous)
The system shall calculate the total suitability score using the formula: S_Total = (0.50 × S_Skill) + (0.30 × S_Availability) + (0.20 × S_Role).

### REQ-6.3 (Optional)
Where multiple skills are requested, the system shall calculate the Skill Match Score as an average of individual skill matches.

### REQ-6.4 (Unwanted behaviour)
If a skill is missing, then the system shall assign a score of 0 for that skill.

### REQ-6.5 (Optional)
Where a candidate has a skill level of 4 or 5, the system shall assign a maximum score for that skill.

### REQ-6.6 (Optional)
Where a candidate has a skill level below 4, the system shall assign a reduced score for that skill.

### REQ-6.7 (Optional)
Where a candidate's allocation is 0%, the system shall assign an Availability Score of 100.

### REQ-6.8 (Optional)
Where a candidate's allocation is between 1% and 50%, the system shall assign an Availability Score of 70.

### REQ-6.9 (Optional)
Where a candidate's allocation is greater than 50%, the system shall assign an Availability Score of 20.

### REQ-6.10 (Ubiquitous)
The system shall determine role alignment based on exact matches.

### REQ-6.11 (Ubiquitous)
The system shall factor project duration and urgency into candidate availability and suitability scoring.

### REQ-6.12 (Ubiquitous)
The system shall use rules-based scoring only.

---

# Feature 7: Candidate Profile Breakdown

### REQ-7.1 (Event-driven)
When candidates are displayed, the system shall show profile data and the total suitability score as a percentage.

### REQ-7.2 (Event-driven)
When the user expands a candidate, the system shall show the calculated Skill Match, Availability, and Role Alignment scores.

### REQ-7.3 (State-driven)
While breakdown is open, the system shall display the raw scoring values used in the calculation.

### REQ-7.4 (Ubiquitous)
The system shall provide rule-based explanations for each recommendation.

### REQ-7.5 (Optional)
Where a candidate is immediately available, the system shall display an "Available Now" status.

### REQ-7.6 (Optional)
Where a candidate has high allocation, the system shall display specific availability constraints.

### REQ-7.7 (Ubiquitous)
The system shall display scoring visuals for quick assessment.

---

# Feature 8: Proposed Squad Builder

### REQ-8.1 (Event-driven)
When a user assigns a candidate, the system shall add them to the proposed squad.

### REQ-8.2 (Unwanted behaviour)
If a user attempts a duplicate assignment, then the system shall prevent the action and display an error.

### REQ-8.3 (State-driven)
While a candidate is assigned, the system shall display them in a sticky footer tray workspace.

### REQ-8.4 (Event-driven)
When a user removes a candidate, the system shall update the squad and filled seat count.

### REQ-8.5 (State-driven)
While the squad builder is active, the system shall display the number of filled squad seats.

### REQ-8.6 (Event-driven)
When candidates are selected, the system shall enable finalize, reset, and export actions.

### REQ-8.7 (Event-driven)
When the user finalizes the squad, the system shall display a confirmation summary of selected members.

### REQ-8.8 (Event-driven)
When the user resets the squad, the system shall clear all candidates from the workspace.