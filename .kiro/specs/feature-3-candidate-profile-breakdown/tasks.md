# TASKS — Feature 3: Candidate Profile Breakdown

## Task 1: Create Candidate Card Component

- **Status:** not_started
- **Refs:** REQ-019
- **Files:** `packages/frontend/src/components/CandidateCard.tsx`
- **Description:** Create a card component displaying: avatar, name, primary role, availability badge, allocation %, core skills as tags, total suitability score circle, score bars, "View Breakdown" button, and "Assign to Squad" button. Use Tailwind utility classes.

## Task 2: Create Score Bar Component

- **Status:** not_started
- **Refs:** REQ-023
- **Files:** `packages/frontend/src/components/ScoreBar.tsx`
- **Description:** Create a reusable progress bar component. Props: `label`, `value`, `max`. Display label on left, fraction on right, coloured bar proportional to value/max. Dynamic width via inline `style={{ width }}`.

## Task 3: Create Availability Badge Component

- **Status:** not_started
- **Refs:** REQ-022
- **Files:** `packages/frontend/src/components/AvailabilityBadge.tsx`
- **Description:** Display availability label based on allocation %. Use green (0%), yellow (1-50%), orange (>50%). MUST include text — colour alone is not sufficient. When >50%, make the badge visually prominent.

## Task 4: Add Breakdown Accordion Interaction

- **Status:** not_started
- **Refs:** REQ-020
- **Files:** `packages/frontend/src/components/CandidateBreakdown.tsx`
- **Description:** On "View Breakdown" click, expand an inline accordion showing raw S_Skill, S_Avail, S_Role, S_Total values with labels and bars. Use local `useState` for open/closed state.

## Task 5: Display Rule-Based Recommendation Reason

- **Status:** not_started
- **Refs:** REQ-021
- **Files:** `packages/frontend/src/utils/generate-reason.ts`
- **Description:** Create `generateReason(scored, candidate): string` function using the template from design.md. Display inside the breakdown panel. MUST be rules-based text generation, NOT AI.

## Task 6: Add Allocation Constraint Warning

- **Status:** not_started
- **Refs:** REQ-022
- **Files:** `packages/frontend/src/components/CandidateCard.tsx`
- **Description:** When a candidate's allocation > 50%, display "Limited Capacity" badge prominently on the card (orange variant). Add aria-label for accessibility.

## Task 7: Unit Tests for Reason Generation

- **Status:** not_started
- **Refs:** REQ-021
- **Files:** `packages/frontend/src/utils/generate-reason.test.ts`
- **Description:** Vitest tests for `generateReason`: high skill + exact role + full availability, low skill + role mismatch + limited availability, and mixed scenarios.
