# DESIGN — Feature 2: Matchmaking & Scoring Engine

## Purpose

Rank mock employee profiles based on how well they match the captured delivery need using deterministic rules-based scoring.

---

## Scoring Model

| Factor           | Weight | Source Data                                           |
|------------------|-------:|-------------------------------------------------------|
| Skill Match      | 50%    | Required skills compared to candidate skills + levels |
| Availability     | 30%    | Candidate current allocation percentage               |
| Role Alignment   | 20%    | Requested role vs candidate primary role              |

---

## Formula

```
S_Total = (0.50 × S_Skill) + (0.30 × S_Avail) + (0.20 × S_Role)
```

---

## Skill Score Rules

| Condition                                | Score |
|------------------------------------------|------:|
| Exact skill name NOT found in profile    | 0     |
| Exact skill found AND level < 4          | 80    |
| Exact skill found AND level >= 4         | 100   |

For multiple required skills: `S_Skill = average(all required skill scores)`

---

## Availability Score Rules

| Current Allocation     | Score |
|------------------------|------:|
| Exactly 0%             | 100   |
| 1% to 50% (inclusive)  | 70    |
| Greater than 50%       | 20    |

---

## Role Alignment Rules

| Condition                                           | Score |
|-----------------------------------------------------|------:|
| Candidate primary role EXACTLY matches requested    | 100   |
| Candidate primary role does NOT match               | 0     |

---

## Mock Candidate Data Shape

```ts
interface CandidateProfile {
  id: string;                // "EMP-001"
  name: string;
  primaryRole: string;
  skills: { name: string; level: number }[];  // level: 1-5
  currentAllocationPercentage: number;        // 0-100
  availabilityLabel: string;                  // "Available Now" | "Partial Capacity" | "Limited Capacity"
  businessDomain: string;
}
```

---

## Scoring Output Shape

```ts
interface ScoredCandidate {
  candidateId: string;
  name: string;
  sSkill: number;    // 0-100
  sAvail: number;    // 0, 20, 70, or 100
  sRole: number;     // 0 or 100
  sTotal: number;    // weighted sum
}
```

---

## Example Calculation

Given candidate Thabo Mokoena, required skills ["React", "Node", "AWS"], required role "Frontend Engineer":

| Skill  | Found? | Level | Score |
|--------|--------|------:|------:|
| React  | Yes    | 5     | 100   |
| Node   | Yes    | 4     | 100   |
| AWS    | Yes    | 3     | 80    |

- `S_Skill = (100 + 100 + 80) / 3 = 93.33`
- `S_Avail = 70` (allocation is 40%, between 1-50%)
- `S_Role = 100` (primary role matches exactly)
- `S_Total = (0.50 × 93.33) + (0.30 × 70) + (0.20 × 100) = 46.67 + 21 + 20 = 87.67`

---

## Tech Alignment

- Pure functions, no side effects — scoring functions MUST be independently unit-testable
- NO AI/ML libraries (REQ-018)
- File location: `packages/backend/src/services/scoring-service.ts`
- Tests: `packages/backend/src/services/scoring-service.test.ts`
