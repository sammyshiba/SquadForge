# API Specification (SquadForge - Combined Feature Spec Aligned)

## POST /workspace/demand
Capture demand and trigger scoring.

**Request body:**
- squadIntent (string, required) — description of work
- projectCode (string, required) — project identifier
- priorityLevel (string, required) — urgency level
- requiredRole (string, required) — role needed
- requiredSkills (array of strings, required) — required skills
- expectedDurationWeeks (number, required) — duration
- businessDomain (string, required) — domain

**Success response (201):**
- demand_id — unique identifier
- status — "SCORING_TRIGGERED"

**Error responses:**
- 400 — validation failed

**Example:**
Request: { "squadIntent": "App Refactor", "projectCode": "ZAF-2024-081", "priorityLevel": "High", "requiredRole": "Frontend Engineer", "requiredSkills": ["React"], "expectedDurationWeeks": 6, "businessDomain": "Retail Banking" }
Response: { "demand_id": "D001", "status": "SCORING_TRIGGERED" }

---

## GET /workspace/{demand_id}/candidates
Retrieve ranked candidates after scoring.

**Request body:** None

**Success response (200):**
- demand_id — identifier
- candidates — ranked list
  - candidateId — ID
  - name — name
  - primaryRole — role
  - sSkill — skill score
  - sAvail — availability score
  - sRole — role score
  - sTotal — total suitability
  - availabilityLabel — label
  - currentAllocationPercentage — workload

**Error responses:**
- 404 — demand not found

**Example:**
Response: { "demand_id": "D001", "candidates": [{ "candidateId": "EMP-001", "name": "Thabo", "primaryRole": "Frontend Engineer", "sSkill": 93.3, "sAvail": 70, "sRole": 100, "sTotal": 87.6, "availabilityLabel": "Available Now", "currentAllocationPercentage": 40 }] }

---

## GET /workspace/{demand_id}/candidates/{candidateId}/breakdown
Retrieve scoring breakdown and explanation.

**Request body:** None

**Success response (200):**
- candidateId — identifier
- sSkill — skill score
- sAvail — availability score
- sRole — role score
- sTotal — total suitability
- reason — rule-based explanation

**Error responses:**
- 404 — not found

**Example:**
Response: { "candidateId": "EMP-001", "sSkill": 93.3, "sAvail": 70, "sRole": 100, "sTotal": 87.6, "reason": "Strong skill match and role alignment" }

---

## POST /squad
Create a proposed squad workspace.

**Request body:**
- demand_id (string, required)

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
- candidateId (string, required)

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
Finalize squad and return summary.

**Request body:** None

**Success response (200):**
- squad_id — identifier
- status — "FINALIZED"
- squadMembers — list of members with scores

**Error responses:**
- 400 — empty squad

**Example:**
Response: { "squad_id": "SQ1", "status": "FINALIZED", "squadMembers": [{ "candidateId": "EMP-001", "sTotal": 87.6 }] }

---

## POST /squad/{squad_id}/reset
Reset squad selection.

**Request body:** None

**Success response (200):**
- squad_id — identifier
- filledSeats — 0

**Error responses:**
- 404 — squad not found

**Example:**
Response: { "squad_id": "SQ1", "filledSeats": 0 }

---

## GET /squad/{squad_id}/export
Export squad summary.

**Request body:** None

**Success response (200):**
- projectCode — project reference
- squadIntent — description
- filledSeats — number
- squadMembers — members list

**Error responses:**
- 404 — squad not found

**Example:**
Response: { "projectCode": "ZAF-2024-081", "squadIntent": "App Refactor", "filledSeats": 2, "squadMembers": [{ "name": "Thabo", "primaryRole": "Frontend", "sTotal": 87.6 }] }
