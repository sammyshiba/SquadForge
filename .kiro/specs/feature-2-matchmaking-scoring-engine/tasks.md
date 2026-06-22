# TASKS — Feature 2: Matchmaking & Scoring Engine

## Task 1: Create Mock Candidate Dataset

- **Status:** not_started
- **Refs:** REQ-007, REQ-018
- **Files:** `packages/backend/src/data/candidates.ts`
- **Description:** Create a TypeScript file exporting an array of at least 8 mock candidate profiles conforming to the `CandidateProfile` interface. Include a variety of roles, skill levels, and allocation percentages to test all scoring branches.

## Task 2: Implement Skill Score Calculation

- **Status:** not_started
- **Refs:** REQ-009, REQ-010, REQ-011, REQ-012
- **Files:** `packages/backend/src/services/scoring-service.ts`
- **Description:** Create a pure function `calculateSkillScore(requiredSkills: string[], candidateSkills: {name: string; level: number}[]): number`. For each required skill: 0 if not found, 80 if found with level < 4, 100 if found with level >= 4. Return the average.

## Task 3: Implement Availability Score Calculation

- **Status:** not_started
- **Refs:** REQ-013, REQ-014, REQ-015
- **Files:** `packages/backend/src/services/scoring-service.ts`
- **Description:** Create a pure function `calculateAvailabilityScore(allocationPercentage: number): number`. Return 100 if 0%, 70 if 1-50%, 20 if >50%.

## Task 4: Implement Role Alignment Calculation

- **Status:** not_started
- **Refs:** REQ-016, REQ-017
- **Files:** `packages/backend/src/services/scoring-service.ts`
- **Description:** Create a pure function `calculateRoleScore(requestedRole: string, candidateRole: string): number`. Return 100 if exact string match, 0 otherwise.

## Task 5: Implement Total Suitability Score Calculation

- **Status:** not_started
- **Refs:** REQ-008
- **Files:** `packages/backend/src/services/scoring-service.ts`
- **Description:** Create a pure function `calculateTotalScore(sSkill: number, sAvail: number, sRole: number): number`. Formula: `(0.50 × sSkill) + (0.30 × sAvail) + (0.20 × sRole)`. Round to 2 decimal places.

## Task 6: Implement Candidate Ranking

- **Status:** not_started
- **Refs:** REQ-003, REQ-008
- **Files:** `packages/backend/src/services/scoring-service.ts`
- **Description:** Create function `rankCandidates(demandCriteria, candidates): ScoredCandidate[]`. Compute all scores per candidate, sort descending by `sTotal`, return array.

## Task 7: Add Unit Tests for Scoring Rules

- **Status:** not_started
- **Refs:** REQ-008 through REQ-018
- **Files:** `packages/backend/src/services/scoring-service.test.ts`
- **Description:** Write Vitest tests covering: all skill score branches (not found, level < 4, level >= 4, average of multiple), all availability bands (0%, 1-50%, >50%), role match/no match, total score formula, and ranking sort order. Minimum 10 test cases.
