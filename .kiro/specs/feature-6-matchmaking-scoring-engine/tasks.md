# Implementation Plan: Matchmaking & Scoring Engine (Feature 6)

## Overview

This plan covers the Feature 6–specific implementation: the `applyDurationUrgencyFactor` function, comprehensive property-based tests using fast-check (all 6 correctness properties), test generators (arbitraries), and boundary-focused unit tests. The basic scoring functions (`calculateSkillScore`, `calculateAvailabilityScore`, `calculateRoleScore`, `calculateTotalScore`, `rankCandidates`) are assumed to exist from Feature 5. These tasks extend and harden the scoring engine with duration/urgency logic and a full property-based test suite.

## Tasks

- [ ] 1. Implement duration/urgency factor logic
  - [ ] 1.1 Add the `applyDurationUrgencyFactor` function to `packages/backend/src/services/scoring-service.ts`
    - Implement the urgency multiplier lookup table (3×3 matrix: priority × duration band)
    - Apply the multiplier to `rawAvailScore` and clamp result to [0, 100]
    - Duration bands: ≤4 weeks, 5–8 weeks, >8 weeks
    - Priority levels: Low, Medium, High
    - Multiplier values per design: Low/Short=1.0, Low/Med=1.0, Low/Long=1.05, Medium/Short=1.0, Medium/Med=1.05, Medium/Long=1.10, High/Short=1.05, High/Med=1.10, High/Long=1.15
    - Export the function with explicit return type annotation
    - _Requirements: REQ-6.11_

  - [ ] 1.2 Integrate `applyDurationUrgencyFactor` into `rankCandidates`
    - Update `rankCandidates` to call `applyDurationUrgencyFactor` after computing raw availability score
    - Pass `expectedDurationWeeks` and `priorityLevel` from `DemandCriteria`
    - Use the adjusted availability score in `calculateTotalScore`
    - Ensure `ScoredCandidate.sAvail` reflects the adjusted (post-multiplier) value
    - _Requirements: REQ-6.11, REQ-6.2_

- [ ] 2. Checkpoint - Verify duration/urgency integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Create test generators (arbitraries) for property-based tests
  - [ ] 3.1 Add fast-check dependency and create test generator helpers in `packages/backend/src/services/scoring-service.test.ts`
    - Install `fast-check` as a dev dependency in `packages/backend`
    - Create `arbEmployee()` generator producing valid `Employee` objects with realistic role/skill/allocation values
    - Create `arbDemandCriteria()` generator producing valid `DemandCriteria` with constrained skills, roles, duration, and priority
    - Use `fc.constantFrom` for enumerated fields (roles, skills, priority levels, business domains)
    - Use `fc.integer` with min/max for allocation percentage (0–100) and duration (1–52)
    - _Requirements: REQ-6.1, REQ-6.2, REQ-6.11_

- [ ] 4. Implement property-based tests (Correctness Properties 1–6)
  - [ ] 4.1 Write property test for Property 1: Total Score is Weighted Sum of Sub-Scores
    - **Property 1: Total Score is Weighted Sum of Sub-Scores**
    - **Validates: Requirements REQ-6.2**
    - For any sSkill, sAvail, sRole in [0, 100], verify `calculateTotalScore` equals `Math.round(((0.5 * sSkill) + (0.3 * sAvail) + (0.2 * sRole)) * 100) / 100`
    - Use `fc.float({ min: 0, max: 100, noNaN: true })` for sub-score generation
    - Minimum 100 iterations (`{ numRuns: 100 }`)
    - Tag: `Feature: feature-6-matchmaking-scoring-engine, Property 1: Total Score is Weighted Sum of Sub-Scores`

  - [ ] 4.2 Write property test for Property 2: Individual Skill Score Classification
    - **Property 2: Individual Skill Score Classification**
    - **Validates: Requirements REQ-6.4, REQ-6.5, REQ-6.6**
    - For any skill name and candidate skills array, verify: missing → 0, level < 4 → 80, level ≥ 4 → 100
    - Note: `scoreIndividualSkill` is not exported; test via `calculateSkillScore` with a single required skill
    - Minimum 100 iterations
    - Tag: `Feature: feature-6-matchmaking-scoring-engine, Property 2: Individual Skill Score Classification`

  - [ ] 4.3 Write property test for Property 3: Skill Score is Arithmetic Mean
    - **Property 3: Skill Score is Arithmetic Mean of Individual Scores**
    - **Validates: Requirements REQ-6.3**
    - For any non-empty list of required skills and candidate skills, verify `calculateSkillScore` returns the arithmetic mean of individual scores
    - Use `fc.array` with `minLength: 1` for required skills
    - Minimum 100 iterations
    - Tag: `Feature: feature-6-matchmaking-scoring-engine, Property 3: Skill Score is Arithmetic Mean`

  - [ ] 4.4 Write property test for Property 4: Availability Score Band Mapping
    - **Property 4: Availability Score Band Mapping**
    - **Validates: Requirements REQ-6.7, REQ-6.8, REQ-6.9**
    - For any allocation in [0, 100]: 0 → 100, 1–50 → 70, 51–100 → 20
    - Use `fc.integer({ min: 0, max: 100 })`
    - Minimum 100 iterations
    - Tag: `Feature: feature-6-matchmaking-scoring-engine, Property 4: Availability Score Band Mapping`

  - [ ] 4.5 Write property test for Property 5: Role Score Binary Classification
    - **Property 5: Role Score Binary Classification**
    - **Validates: Requirements REQ-6.10**
    - For any two role strings: identical → 100, different → 0
    - Use `fc.string({ minLength: 1 })` for both roles
    - Minimum 100 iterations
    - Tag: `Feature: feature-6-matchmaking-scoring-engine, Property 5: Role Score Binary Classification`

  - [ ] 4.6 Write property test for Property 6: All Scores Bounded [0, 100]
    - **Property 6: All Scores Bounded [0, 100]**
    - **Validates: Requirements REQ-6.1, REQ-6.2**
    - For any valid `DemandCriteria` and `Employee`, all computed scores (sSkill, sAvail, sRole, sTotal) are within [0, 100]
    - Use `arbDemandCriteria()` and `arbEmployee()` generators
    - Minimum 100 iterations
    - Tag: `Feature: feature-6-matchmaking-scoring-engine, Property 6: All Scores Bounded [0, 100]`

- [ ] 5. Checkpoint - Property tests green
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Write example-based unit tests for edge cases and boundaries
  - [ ] 6.1 Write unit tests for `applyDurationUrgencyFactor` boundary cases
    - Test each cell of the 3×3 multiplier matrix (9 test cases)
    - Test boundary durations: exactly 4 weeks, exactly 5 weeks, exactly 8 weeks, exactly 9 weeks
    - Test clamping: raw score 100 with High/Long multiplier (1.15) → clamped to 100
    - Test raw score 20 with various multipliers to verify low scores remain low
    - _Requirements: REQ-6.11_

  - [ ] 6.2 Write unit tests for scoring edge cases
    - Test `calculateSkillScore` with empty `requiredSkills` array → returns 0
    - Test `calculateAvailabilityScore` with exact boundaries: 0, 1, 50, 51, 100
    - Test `calculateRoleScore` with case-sensitive comparison (e.g., "Backend Engineer" vs "backend engineer" → 0)
    - Test `rankCandidates` with empty employee list → returns empty array
    - Test `rankCandidates` sort order with multiple candidates having different total scores
    - Test `availabilityLabel` derivation: 0% → "Available Now", 25% → "Partial Capacity", 75% → "Limited Capacity"
    - _Requirements: REQ-6.1, REQ-6.2, REQ-6.7, REQ-6.8, REQ-6.9, REQ-6.10_

- [ ] 7. Final checkpoint - Full test suite green
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The `scoreIndividualSkill` helper is internal (not exported) — property 2 tests it indirectly via `calculateSkillScore` with a single required skill
- fast-check is the PBT library; all property tests use `{ numRuns: 100 }` minimum
- All code targets `packages/backend/src/services/scoring-service.ts` and `scoring-service.test.ts`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["4.1", "4.4", "4.5"] },
    { "id": 4, "tasks": ["4.2", "4.3", "4.6"] },
    { "id": 5, "tasks": ["6.1", "6.2"] }
  ]
}
```
