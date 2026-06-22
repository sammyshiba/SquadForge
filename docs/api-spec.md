# API SPECIFICATION — SquadForge

> **CONSTRAINT:** All responses use the `{ data }` / `{ error }` envelope defined in `conventions.md` RULE 4.  
> **Backend:** Express + Prisma + SQLite. Zod validation on all request bodies.  
> **Scoring:** Rules-based only (REQ-6.8). NO AI/ML.

---

## Response Envelope

**Success:**
```json
{ "data": { ... } }
```

**Error:**
```json
{ "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

---

## Health & Info

### GET /health

**Response 200:**
```json
{ "data": { "status": "ok", "timestamp": "2024-01-15T10:30:00.000Z" } }
```

### GET /api/health

**Response 200:**
```json
{ "data": { "status": "ok", "timestamp": "2024-01-15T10:30:00.000Z", "uptime": 12345.67 } }
```

### GET /api/info

**Response 200:**
```json
{ "data": { "name": "squadforge-api", "version": "1.0.0", "environment": "development" } }
```

### POST /api/echo

**Request:**
```json
{ "message": "hello" }
```

**Response 200:**
```json
{ "data": { "echo": { "message": "hello" }, "timestamp": "2024-01-15T10:30:00.000Z" } }
```

---

## Demand & Scoring

### POST /api/workspace/demand

Capture a delivery need and trigger candidate scoring.

**Request (Zod-validated):**
```json
{
  "squadIntent": "Retail Banking App Refactor",
  "projectCode": "ZAF-2024-081",
  "priorityLevel": "Urgent - Regulatory",
  "requiredRole": "Frontend Engineer",
  "requiredSkills": ["React", "Node", "AWS"],
  "expectedDurationWeeks": 6,
  "businessDomain": "Retail Banking"
}
```

**Response 201:**
```json
{ "data": { "demandId": "D001", "status": "SCORING_TRIGGERED" } }
```

**Errors:**
| Status | Code              | Condition                        |
|--------|-------------------|----------------------------------|
| 400    | VALIDATION_FAILED | Missing required fields or invalid format |

---

### GET /api/workspace/:demandId/candidates

Retrieve ranked candidates for a demand.

**Response 200:**
```json
{
  "data": {
    "demandId": "D001",
    "candidates": [
      {
        "candidateId": "EMP-001",
        "name": "Thabo Mokoena",
        "primaryRole": "Frontend Engineer",
        "skills": [{ "name": "React", "level": 5 }, { "name": "Node", "level": 4 }],
        "currentAllocationPercentage": 40,
        "availabilityLabel": "Partial Capacity",
        "sSkill": 93.33,
        "sAvail": 70,
        "sRole": 100,
        "sTotal": 87.67
      }
    ]
  }
}
```

**Errors:**
| Status | Code          | Condition         |
|--------|---------------|-------------------|
| 404    | NOT_FOUND     | Demand ID invalid |

---

### GET /api/workspace/:demandId/candidates/:candidateId/breakdown

Retrieve detailed scoring breakdown with rule-based explanation.

**Response 200:**
```json
{
  "data": {
    "candidateId": "EMP-001",
    "name": "Thabo Mokoena",
    "sSkill": 93.33,
    "sAvail": 70,
    "sRole": 100,
    "sTotal": 87.67,
    "reason": "Strong skill match, exact role alignment, moderate allocation (40%)."
  }
}
```

**Errors:**
| Status | Code      | Condition             |
|--------|-----------|-----------------------|
| 404    | NOT_FOUND | Demand or candidate ID invalid |

---

## Squad Management

### POST /api/squad

Create a new proposed squad workspace for a demand.

**Request:**
```json
{ "demandId": "D001" }
```

**Response 201:**
```json
{ "data": { "squadId": "SQ1", "demandId": "D001", "filledSeats": 0, "status": "draft" } }
```

**Errors:**
| Status | Code      | Condition         |
|--------|-----------|--------------------|
| 404    | NOT_FOUND | Demand ID invalid  |

---

### POST /api/squad/:squadId/members

Assign a candidate to the squad.

**Request:**
```json
{ "candidateId": "EMP-001" }
```

**Response 200:**
```json
{ "data": { "squadId": "SQ1", "filledSeats": 1, "addedCandidate": "EMP-001" } }
```

**Errors:**
| Status | Code               | Condition                  |
|--------|--------------------|----------------------------|
| 400    | DUPLICATE_MEMBER   | Candidate already assigned |
| 404    | NOT_FOUND          | Squad ID invalid           |

---

### DELETE /api/squad/:squadId/members/:candidateId

Remove a candidate from the squad.

**Response 200:**
```json
{ "data": { "squadId": "SQ1", "filledSeats": 0, "removedCandidate": "EMP-001" } }
```

**Errors:**
| Status | Code      | Condition                      |
|--------|-----------|--------------------------------|
| 404    | NOT_FOUND | Squad or candidate not found   |

---

### POST /api/squad/:squadId/finalize

Lock the squad and return confirmation summary.

**Response 200:**
```json
{
  "data": {
    "squadId": "SQ1",
    "status": "finalized",
    "squadMembers": [
      { "candidateId": "EMP-001", "name": "Thabo Mokoena", "primaryRole": "Frontend Engineer", "sTotal": 87.67 },
      { "candidateId": "EMP-004", "name": "Sarah Jenkins", "primaryRole": "Product Owner", "sTotal": 82.40 }
    ]
  }
}
```

**Errors:**
| Status | Code         | Condition         |
|--------|--------------|-------------------|
| 400    | EMPTY_SQUAD  | No members assigned |
| 404    | NOT_FOUND    | Squad ID invalid  |

---

### POST /api/squad/:squadId/reset

Clear all assigned members, return squad to draft state.

**Response 200:**
```json
{ "data": { "squadId": "SQ1", "filledSeats": 0, "status": "draft" } }
```

**Errors:**
| Status | Code      | Condition         |
|--------|-----------|-------------------|
| 404    | NOT_FOUND | Squad ID invalid  |

---

### GET /api/squad/:squadId/export

Export squad summary for review/download.

**Response 200:**
```json
{
  "data": {
    "projectCode": "ZAF-2024-081",
    "squadIntent": "Retail Banking App Refactor",
    "filledSeats": 2,
    "squadMembers": [
      { "candidateId": "EMP-001", "name": "Thabo Mokoena", "primaryRole": "Frontend Engineer", "sTotal": 87.67 }
    ]
  }
}
```

**Errors:**
| Status | Code      | Condition         |
|--------|-----------|-------------------|
| 404    | NOT_FOUND | Squad ID invalid  |

---

## Scoring Formula Reference

```
S_Total = (0.50 × S_Skill) + (0.30 × S_Avail) + (0.20 × S_Role)

Skill Score:
  - Skill not found → 0
  - Skill found, level < 4 → 80
  - Skill found, level ≥ 4 → 100
  - Multiple skills → average

Availability Score:
  - 0% allocated → 100
  - 1–50% allocated → 70
  - >50% allocated → 20

Role Score:
  - Exact match → 100
  - No match → 0
```
