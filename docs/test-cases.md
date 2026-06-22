# TEST CASES — SquadForge

> **Framework:** Vitest (unit), Playwright (E2E). See `conventions.md` RULE 7.

---

## Feature 1: Project Setup

### TC-1.1: Monorepo Install

**Requirement:** REQ-1.1  
**Type:** Integration  
**Priority:** Critical

**Steps:**
1. Clone fresh repo
2. Run `npm install` at root

**Expected:** All workspace dependencies installed. No errors.

---

## Feature 2: Backend API

### TC-2.1: Health Endpoint

**Requirement:** REQ-2.1  
**Type:** Unit  
**Priority:** High

**Steps:**
1. Send `GET /health`

**Expected:** 200 response with `{ data: { status: "ok", timestamp: <ISO string> } }`

### TC-2.2: Echo Endpoint

**Requirement:** REQ-2.4  
**Type:** Unit  
**Priority:** Medium

**Steps:**
1. Send `POST /api/echo` with `{ "message": "hello" }`

**Expected:** 200 response with `{ data: { echo: { message: "hello" }, timestamp: <ISO string> } }`

### TC-2.3: Error Handler

**Requirement:** REQ-2.6  
**Type:** Unit  
**Priority:** High

**Steps:**
1. Trigger an unhandled error in a route

**Expected:** Structured error response `{ error: { code, message } }`. Server does NOT crash.

---

## Feature 5: Demand & Search Workspace

### TC-5.1: Valid Demand Submission

**Requirement:** REQ-5.2  
**Type:** Integration  
**Priority:** Critical

**Steps:**
1. Fill all required fields with valid data
2. Click "Generate Recommendations"

**Expected:** POST succeeds. Candidate list appears sorted by sTotal descending.

### TC-5.2: Missing Role Validation

**Requirement:** REQ-5.5  
**Type:** Unit  
**Priority:** High

**Steps:**
1. Leave required role empty
2. Submit form

**Expected:** Inline error "Required role is missing". No API call made.

### TC-5.3: Missing Skills Validation

**Requirement:** REQ-5.6  
**Type:** Unit  
**Priority:** High

**Steps:**
1. Leave required skills empty
2. Submit form

**Expected:** Inline error "At least one skill is required". No API call made.

### TC-5.4: Real-time Recalculation

**Requirement:** REQ-5.4  
**Type:** Integration  
**Priority:** Medium

**Steps:**
1. Submit valid demand and see results
2. Change a form field

**Expected:** Candidate list re-sorts within 1 second without manual resubmit.

---

## Feature 6: Matchmaking & Scoring Engine

### TC-6.1: Skill Score — Not Found

**Requirement:** REQ-6.3  
**Type:** Unit  
**Priority:** Critical

**Input:** requiredSkills: ["GraphQL"], candidate skills: [{ name: "React", level: 5 }]  
**Expected:** `calculateSkillScore` returns 0.

### TC-6.2: Skill Score — High Level

**Requirement:** REQ-6.4  
**Type:** Unit  
**Priority:** Critical

**Input:** requiredSkills: ["React"], candidate skills: [{ name: "React", level: 5 }]  
**Expected:** `calculateSkillScore` returns 100.

### TC-6.3: Skill Score — Low Level

**Requirement:** REQ-6.5  
**Type:** Unit  
**Priority:** Critical

**Input:** requiredSkills: ["React"], candidate skills: [{ name: "React", level: 2 }]  
**Expected:** `calculateSkillScore` returns 80.

### TC-6.4: Skill Score — Average of Multiple

**Requirement:** REQ-6.2  
**Type:** Unit  
**Priority:** Critical

**Input:** requiredSkills: ["React", "Node"], candidate skills: [{ name: "React", level: 5 }, { name: "Node", level: 3 }]  
**Expected:** `calculateSkillScore` returns (100 + 80) / 2 = 90.

### TC-6.5: Availability — Zero Allocation

**Requirement:** REQ-6.6  
**Type:** Unit  
**Priority:** High

**Input:** allocation: 0  
**Expected:** `calculateAvailabilityScore` returns 100.

### TC-6.6: Availability — Partial Allocation

**Requirement:** REQ-6.6  
**Type:** Unit  
**Priority:** High

**Input:** allocation: 40  
**Expected:** `calculateAvailabilityScore` returns 70.

### TC-6.7: Availability — High Allocation

**Requirement:** REQ-6.6  
**Type:** Unit  
**Priority:** High

**Input:** allocation: 80  
**Expected:** `calculateAvailabilityScore` returns 20.

### TC-6.8: Role — Exact Match

**Requirement:** REQ-6.7  
**Type:** Unit  
**Priority:** High

**Input:** requested: "Frontend Engineer", candidate: "Frontend Engineer"  
**Expected:** `calculateRoleScore` returns 100.

### TC-6.9: Role — No Match

**Requirement:** REQ-6.7  
**Type:** Unit  
**Priority:** High

**Input:** requested: "Frontend Engineer", candidate: "DevOps Engineer"  
**Expected:** `calculateRoleScore` returns 0.

### TC-6.10: Total Score Formula

**Requirement:** REQ-6.1  
**Type:** Unit  
**Priority:** Critical

**Input:** sSkill: 93.33, sAvail: 70, sRole: 100  
**Expected:** `calculateTotalScore` returns 87.67 (rounded to 2dp).

---

## Feature 7: Candidate Breakdown

### TC-7.1: Breakdown Accordion

**Requirement:** REQ-7.2  
**Type:** E2E  
**Priority:** High

**Steps:**
1. View candidates
2. Click "View Breakdown" on a card

**Expected:** Accordion expands showing skill, availability, role scores and reason text.

### TC-7.2: Reason Text Generation

**Requirement:** REQ-7.4  
**Type:** Unit  
**Priority:** Medium

**Input:** sSkill: 93, sAvail: 70, sRole: 100, allocation: 40  
**Expected:** Returns string containing "Strong skill alignment" and "exact role match".

---

## Feature 8: Proposed Squad Builder

### TC-8.1: Assign Candidate

**Requirement:** REQ-8.1  
**Type:** E2E  
**Priority:** Critical

**Steps:**
1. Click "Assign to Squad" on a candidate card

**Expected:** Candidate appears in footer. Button changes to "Assigned" (disabled). Count updates.

### TC-8.2: Prevent Duplicate

**Requirement:** REQ-8.2  
**Type:** Unit  
**Priority:** High

**Steps:**
1. Assign same candidate twice

**Expected:** Second assignment is a no-op. Array length unchanged.

### TC-8.3: Remove Candidate

**Requirement:** REQ-8.4  
**Type:** E2E  
**Priority:** High

**Steps:**
1. Assign candidate
2. Click × on their chip in footer

**Expected:** Candidate removed. Count decrements. Card button re-enables.

### TC-8.4: Reset Squad

**Requirement:** REQ-8.8  
**Type:** E2E  
**Priority:** Medium

**Steps:**
1. Assign 3 candidates
2. Click Reset → Confirm

**Expected:** Footer clears. All card buttons re-enable. Count = 0.

### TC-8.5: Finalize

**Requirement:** REQ-8.7  
**Type:** E2E  
**Priority:** Critical

**Steps:**
1. Assign at least 1 candidate
2. Click "Finalize Squad"

**Expected:** Navigate to summary page. Shows all assigned candidates with scores.

---

## E2E: Full Journey

### TC-E2E-1: Happy Path

**Type:** E2E (Playwright)  
**Priority:** Critical

**Steps:**
1. Navigate to Demand Center
2. Fill form with valid data
3. Click "Generate Recommendations"
4. Verify candidates appear ranked
5. Click "View Breakdown" on top candidate
6. Verify scores displayed
7. Click "Assign to Squad" on 2 candidates
8. Verify footer shows 2 members
9. Click "Finalize Squad"
10. Verify summary page shows both candidates

**Expected:** Full journey completes without errors.
