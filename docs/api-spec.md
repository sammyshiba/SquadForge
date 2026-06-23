# API Specification (SquadForge)

This document defines the REST API for SquadForge, aligning with the architectural design in `architecture.md` and functional requirements in `requirements.md`.

## Authentication & Standards
- **Base URL:** `/api`
- **Auth:** All domain routes require a `Bearer <JWT>` token.
- **Roles:** Only users with the `delivery_lead` role can perform write operations.
- **Validation:** All request bodies are validated using Zod schemas.
- **Errors:** Returns a standard error envelope: `{ "error": "string", "message": "string", "status": number }`.

---

## 1. Demand & Scoring

### POST /demands
Capture a new delivery demand.

**Request body:**
- `businessDomain` (string, required) — e.g., "Retail Banking"
- `projectCode` (string, required) — project identifier
- `squadIntent` (string, required) — description of the work/goal
- `requiredRole` (enum, required) — `FRONTEND`, `BACKEND`, `FULLSTACK`, `DESIGN`, `QA`, `DATA`, `PLATFORM`
- `requiredSkills` (array of strings, required) — skills needed for the role
- `urgency` (enum, required) — `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `durationWeeks` (number, required) — expected project duration

**Success response (201 Created):**
Returns the created `DemandRequest` object including its unique `id`.

**Example:**
```json
{
  "businessDomain": "Retail Banking",
  "projectCode": "ZAF-2024-081",
  "squadIntent": "App Refactor",
  "requiredRole": "FRONTEND",
  "requiredSkills": ["React", "TypeScript"],
  "urgency": "HIGH",
  "durationWeeks": 12
}
```

---

### POST /score
Trigger deterministic scoring for a specific demand.

**Request body:**
- `demandId` (string, required)

**Success response (200 OK):**
Returns a ranked list of candidates with suitability scores and explanations.
- `demandId` (string)
- `ranked` (array):
    - `candidateId` (string)
    - `name` (string)
    - `primaryRole` (enum)
    - `sTotal` (number) — Total suitability (0-100%)
    - `breakdown` (object):
        - `sSkill` (number) — Skill Match score
        - `sAvail` (number) — Availability score
        - `sRole` (number) — Role Fit score
    - `availabilityLabel` (string) — e.g., "Available Now"
    - `currentAllocationPercentage` (number)
    - `reason` (string) — Rule-based explanation (REQ-7.4)

**Notable Errors:**
- `404`: Demand not found.

---

### GET /demands/:id/candidates/:candidateId/breakdown
Retrieve detailed scoring breakdown for a specific candidate relative to a demand.

**Success response (200 OK):**
- `candidateId` (string)
- `sTotal`, `sSkill`, `sAvail`, `sRole` (numbers)
- `rawValues` (object):
    - `skillsMatched` (array of strings)
    - `allocation` (number)
    - `isExactRoleMatch` (boolean)
- `reason` (string)

---

## 2. Squad Builder

### POST /squads
Create a new proposed squad workspace for a demand.

**Request body:**
- `demandId` (string, required)
- `squadName` (string, required)

**Success response (201 Created):**
- `id` (string) — Squad ID
- `demandId` (string)
- `status` (string) — "DRAFT"
- `filledSeats` (number) — 0

---

### POST /squads/:id/members
Assign an employee to the proposed squad.

**Request body:**
- `employeeId` (string, required)

**Success response (201 Created):**
- `squadId` (string)
- `employeeId` (string)
- `filledSeats` (number) — Updated count

**Notable Errors:**
- `409 Conflict`: Employee already assigned to this squad or over capacity (REQ-8.2).

---

### DELETE /squads/:id/members/:employeeId
Remove an employee from the proposed squad.

**Success response (204 No Content)**

---

### PATCH /squads/:id/status
Update squad status (e.g., finalize).

**Request body:**
- `status` (enum) — `FINALIZED`, `ABANDONED`

**Success response (200 OK):**
- Returns the updated squad object.

**Logic:**
Finalizing a squad triggers the transactional update of member allocation percentages (Arch §8).

---

### POST /squads/:id/reset
Clear all candidates from the squad workspace.

**Success response (200 OK):**
- `id` (string)
- `filledSeats` (number) — 0

---

### GET /squads/:id/export
Export a summary of the squad for reporting.

**Success response (200 OK):**
- `projectCode` (string)
- `businessDomain` (string)
- `squadIntent` (string)
- `members` (array of employee details and scores)
 