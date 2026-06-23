# API Specification (SquadForge - Requirements Driven)

## POST /workspace/demand
Create and store demand criteria, then trigger candidate scoring.

**Request body:**
- squadIntent (string, required) — description of delivery work
- projectCode (string, required) — project identifier
- priorityLevel (string, required) — urgency level
- requiredRole (string, required) — required role
- requiredSkills (array of strings, required) — required skills
- expectedDurationWeeks (number, required) — duration
- businessDomain (string, required) — domain context

**Success response (201):**
- demand_id — unique identifier
- status — "SCORING_TRIGGERED"

**Error responses:**
- 400 — validation failed (missing role, skills, or project code)

**Example:**
Request: { "squadIntent": "Retail App Refactor", "projectCode": "ZAF-2024-081", "priorityLevel": "Urgent", "requiredRole": "Frontend Engineer", "requiredSkills": ["React"], "expectedDurationWeeks": 6, "businessDomain": "Retail Banking" }
Response: { "demand_id": "D001", "status": "SCORING_TRIGGERED" }

---

## GET /workspace/{demand_id}/candidates
Retrieve ranked candidate recommendations.

**Request body:** None

**Success response (200):**
- demand_id — identifier
- candidates — list of ranked candidates
  - candidateId — unique ID
  - name — candidate name
  - primaryRole — role
  - sTotal — suitability score
  - availabilityLabel — availability status
  - currentAllocationPercentage — workload

**Error responses:**
- 404 — demand not found

**Example:**
Response: { "demand_id": "D001", "candidates": [{ "candidateId": "EMP-001", "name": "Thabo", "primaryRole": "Frontend Engineer", "sTotal": 87.6, "availabilityLabel": "Available Now", "currentAllocationPercentage": 40 }] }

---

## GET /workspace/{demand_id}/candidates/{candidateId}/breakdown
Retrieve scoring breakdown and explanation.

**Request body:** None

**Success response (200):**
- candidateId — identifier
- sSkill — skill match score
- sAvailability — availability score
- sRole — role alignment score
- sTotal — total score
- reason — explanation text

**Error responses:**
- 404 — not found

**Example:**
Response: { "candidateId": "EMP-001", "sSkill": 90, "sAvailability": 70, "sRole": 100, "sTotal": 87.6, "reason": "Strong skills and role match with moderate availability" }

---

## GET /api/health
Check backend health.

**Request body:** None

**Success response (200):**
- status — system health
- timestamp — ISO timestamp
- uptime — server uptime

**Error responses:**
- 500 — server error

**Example:**
Response: { "status": "OK", "timestamp": "2026-06-23T09:00:00Z", "uptime": 12345 }

---

## GET /api/info
Retrieve API metadata.

**Request body:** None

**Success response (200):**
- name — API name
- version — version number
- environment — runtime environment

**Error responses:**
- 500 — server error

**Example:**
Response: { "name": "SquadForge API", "version": "1.0.0", "environment": "dev" }

---

## POST /api/echo
Echo request payload.

**Request body:**
- payload (object, required) — any JSON object

**Success response (200):**
- payload — echoed body
- receivedAt — timestamp

**Error responses:**
- 400 — invalid input

**Example:**
Request: { "payload": { "message": "test" } }
Response: { "payload": { "message": "test" }, "receivedAt": "2026-06-23T09:00:00Z" }

---

## POST /squad
Create a proposed squad workspace.

**Request body:**
- demand_id (string, required) — associated demand

**Success response (201):**
- squad_id — identifier
- filledSeats — 0

**Error responses:**
- 404 — demand not found

**Example:**
Request: { "demand_id": "D001" }
Response: { "squad_id": "SQ1", "filledSeats": 0 }

---

## POST /squad/{squad_id}/members
Assign candidate to squad.

**Request body:**
- candidateId (string, required) — candidate to assign

**Success response (200):**
- squad_id — identifier
- filledSeats — updated count

**Error responses:**
- 400 — duplicate assignment
- 404 — squad not found

**Example:**
Request: { "candidateId": "EMP-001" }
Response: { "squad_id": "SQ1", "filledSeats": 1 }

---

## DELETE /squad/{squad_id}/members/{candidateId}
Remove candidate from squad.

**Request body:** None

**Success response (200):**
- squad_id — identifier
- filledSeats — updated count

**Error responses:**
- 404 — not found

**Example:**
Response: { "squad_id": "SQ1", "filledSeats": 0 }

---

## POST /squad/{squad_id}/finalize
Finalize squad selection.

**Request body:** None

**Success response (200):**
- squad_id — identifier
- status — "FINALIZED"
- summary — selected members

**Error responses:**
- 400 — empty squad

**Example:**
Response: { "squad_id": "SQ1", "status": "FINALIZED" }

---

## POST /squad/{squad_id}/reset
Reset squad workspace.

**Request body:** None

**Success response (200):**
- squad_id — identifier
- filledSeats — 0

**Error responses:**
- 404 — squad not found

**Example:**
Response: { "squad_id": "SQ1", "filledSeats": 0 }
