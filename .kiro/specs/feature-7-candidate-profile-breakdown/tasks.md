# Implementation Plan: Candidate Profile Breakdown

## Overview

Implement the Candidate Profile Breakdown feature that transforms scored candidate data into accessible visual presentations with score breakdowns, rule-based explanations, and expand/collapse interactivity. Implementation proceeds from pure utility functions (no dependencies) → individual UI components (parallelizable) → page integration and context wiring → tests.

## Tasks

- [ ] 1. Implement utility functions
  - [ ] 1.1 Create utility functions in `packages/frontend/src/utils/generate-reason.ts`
    - Implement `getScoreColor(value: number): string` — returns `'text-green-600'` if ≥ 80, `'text-amber-600'` if ≥ 60, `'text-red-600'` if < 60
    - Implement `getScoreBarColor(value: number): string` — returns `'bg-green-500'` if ≥ 80, `'bg-amber-500'` if ≥ 60, `'bg-red-500'` if < 60
    - Implement `getAvailabilityLabel(allocation: number): AvailabilityInfo` — returns label ("Available Now" / "Partial Capacity" / "Limited Capacity") and Tailwind className based on allocation thresholds (0, 1–50, >50)
    - Implement `generateReason(sSkill, sAvail, sRole, allocation): string` — pure function producing rule-based explanation by joining skill assessment, availability, and role alignment segments with ", " and appending "."
    - Export the `AvailabilityInfo` interface
    - All functions must be pure with explicit return types
    - _Requirements: 7.4, 7.5, 7.6, 7.7_

  - [ ]* 1.2 Write property tests for utility functions (Properties 3, 4, 5)
    - **Property 3: Reason Generation Follows Score-Based Rules** — For any sSkill in [0,100], sAvail in {20,70,100}, sRole in {0,100}, allocation in [0,100], verify generateReason returns non-empty string ending with "." containing correct keywords based on thresholds
    - **Property 4: Availability Badge Maps Allocation to Correct Label** — For any allocation in [0,100], verify getAvailabilityLabel returns correct label per threshold rules
    - **Property 5: Score Bar Color Follows Threshold Rules** — For any value in [0,100], verify getScoreBarColor returns correct color class per threshold rules
    - Use fast-check with `{ numRuns: 100 }` for each property
    - File: `packages/frontend/src/utils/generate-reason.test.ts`
    - **Validates: Requirements 7.4, 7.5, 7.6, 7.7**

  - [ ]* 1.3 Write unit tests for utility functions
    - Test `getScoreColor` at boundary values: 0, 59, 60, 79, 80, 100
    - Test `getScoreBarColor` at same boundaries
    - Test `getAvailabilityLabel` at: 0, 1, 25, 50, 51, 100
    - Test `generateReason` with concrete examples: high scores, low scores, mixed scenarios
    - File: `packages/frontend/src/utils/generate-reason.test.ts`
    - _Requirements: 7.4, 7.5, 7.6, 7.7_

- [ ] 2. Implement individual UI components
  - [ ] 2.1 Create `AvailabilityBadge` component in `packages/frontend/src/components/AvailabilityBadge.tsx`
    - Accept `allocation: number` prop via `AvailabilityBadgeProps` interface
    - Call `getAvailabilityLabel` to get label and className
    - Render as a `<span>` with the returned Tailwind classes (`rounded-full px-2 py-0.5 text-xs` + color classes)
    - Include `aria-label` with the availability status text
    - _Requirements: 7.5, 7.6_

  - [ ] 2.2 Create `SuitabilityScore` component in `packages/frontend/src/components/SuitabilityScore.tsx`
    - Accept `value: number` prop via `SuitabilityScoreProps` interface
    - Call `getScoreColor` to determine text color class
    - Render the numeric value prominently with the determined color
    - Include `aria-label={`Suitability score: ${value} percent`}`
    - _Requirements: 7.1, 7.7_

  - [ ] 2.3 Create `ScoreBar` component in `packages/frontend/src/components/ScoreBar.tsx`
    - Accept `label: string`, `value: number`, `max: number` props via `ScoreBarProps` interface
    - Render track with `h-2 bg-slate-200 rounded-full`
    - Render fill with dynamic `style={{ width: `${(value / max) * 100}%` }}` and color from `getScoreBarColor`
    - Display label text and numeric value beside the bar
    - Include `aria-label={`${label}: ${value} out of ${max}`}`
    - _Requirements: 7.2, 7.3, 7.7_

  - [ ] 2.4 Create `SkillChip` component in `packages/frontend/src/components/SkillChip.tsx`
    - Accept `name: string`, `level: number` props via `SkillChipProps` interface
    - Render as `bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-xs`
    - Content: `{name} (L{level})`
    - _Requirements: 7.1_

  - [ ] 2.5 Create `CandidateBreakdown` component in `packages/frontend/src/components/CandidateBreakdown.tsx`
    - Accept `sSkill`, `sAvail`, `sRole`, `sTotal`, `currentAllocationPercentage` props via `CandidateBreakdownProps` interface
    - Render three `ScoreBar` components for Skill Match, Availability, and Role Alignment
    - Display total score prominently
    - Call `generateReason(sSkill, sAvail, sRole, currentAllocationPercentage)` and render the explanation text
    - Use semantic HTML (`<section>`, `<dl>` or similar) for structure
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ] 2.6 Create `CandidateCard` component in `packages/frontend/src/components/CandidateCard.tsx`
    - Accept `candidate: ScoredCandidate`, `isExpanded`, `isAssigned`, `onToggleBreakdown`, `onAssign` props via `CandidateCardProps` interface
    - Render avatar, name, primary role, availability badge (using `AvailabilityBadge`), skills (using `SkillChip`), and total score (using `SuitabilityScore`)
    - Include "View Breakdown" button that calls `onToggleBreakdown(candidate.candidateId)`
    - Include "Assign to Squad" button that calls `onAssign(candidate.candidateId)`, disabled when `isAssigned`
    - Conditionally render `CandidateBreakdown` when `isExpanded` is true
    - Handle keyboard interaction (Enter/Space) on the toggle button
    - Style with Tailwind: `bg-white rounded-xl shadow-sm border border-slate-200 p-4`
    - _Requirements: 7.1, 7.2, 7.5, 7.6_

- [ ] 3. Checkpoint
  - Ensure all components render without errors, ask the user if questions arise.

- [ ] 4. Integrate context and page
  - [ ] 4.1 Add breakdown state and actions to SquadContext (`packages/frontend/src/context/SquadContext.tsx`)
    - Add `expandedBreakdown: string | null` to the state interface
    - Add `TOGGLE_BREAKDOWN` action (payload: candidateId) — if current === payload, set null; otherwise set payload
    - Add `COLLAPSE_BREAKDOWN` action — sets expandedBreakdown to null
    - Update the reducer to handle both actions
    - _Requirements: 7.2, 7.3_

  - [ ] 4.2 Implement `CandidateList` page in `packages/frontend/src/pages/CandidateList.tsx`
    - Consume `candidateList` and `expandedBreakdown` from SquadContext
    - Map over candidates rendering a `CandidateCard` for each
    - Pass `isExpanded={expandedBreakdown === candidate.candidateId}` to each card
    - Dispatch `TOGGLE_BREAKDOWN` on card toggle interaction
    - Dispatch squad assignment actions on "Assign" click
    - Include page-level heading and accessible landmark (`<main>`)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 5. Checkpoint
  - Ensure page renders with mock data from context, accordion behavior works correctly, ask the user if questions arise.

- [ ] 6. Component and integration tests
  - [ ]* 6.1 Write property test for CandidateCard (Property 1)
    - **Property 1: Candidate Card Displays All Required Profile Data** — For any valid ScoredCandidate, rendering CandidateCard produces output containing name, primaryRole, and sTotal
    - Create `arbScoredCandidate` arbitrary generator using fast-check
    - Use React Testing Library to render and assert text content
    - `{ numRuns: 100 }`
    - File: `packages/frontend/src/components/CandidateCard.test.tsx`
    - **Validates: Requirements 7.1**

  - [ ]* 6.2 Write property test for CandidateBreakdown (Property 2)
    - **Property 2: Expanded Breakdown Shows Accurate Sub-Scores** — For any valid sub-scores in [0,100], rendering CandidateBreakdown displays all sub-score values accurately
    - Use React Testing Library to render and verify sSkill, sAvail, sRole values appear in output
    - `{ numRuns: 100 }`
    - File: `packages/frontend/src/components/CandidateBreakdown.test.tsx`
    - **Validates: Requirements 7.2, 7.3**

  - [ ]* 6.3 Write unit tests for AvailabilityBadge, ScoreBar, SuitabilityScore, and SkillChip
    - Test AvailabilityBadge renders correct text and aria attributes for each allocation band
    - Test ScoreBar renders correct width style, color class, and aria-label
    - Test SuitabilityScore renders value with correct color and aria-label
    - Test SkillChip renders name and level in correct format
    - Use React Testing Library
    - Files: `packages/frontend/src/components/AvailabilityBadge.test.tsx`, `ScoreBar.test.tsx`, `SuitabilityScore.test.tsx`, `SkillChip.test.tsx`
    - _Requirements: 7.1, 7.5, 7.6, 7.7_

  - [ ]* 6.4 Write integration tests for CandidateList page
    - Test that cards render from context data
    - Test accordion behavior: only one breakdown open at a time
    - Test toggle collapse when clicking same candidate
    - Test assign button state changes
    - Wrap in SquadContext provider with mock data
    - File: `packages/frontend/src/pages/CandidateList.test.tsx`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 7. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All components use TypeScript strict mode with named exports only
- Styling uses Tailwind CSS exclusively (exception: dynamic `style={{ width }}` for ScoreBar fill)
- The `ScoredCandidate` type should be defined in `packages/frontend/src/types/index.ts` or imported from shared types

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.1", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["2.5", "2.6"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["4.2"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3", "6.4"] }
  ]
}
```
