# DESIGN — Feature 4: Proposed Squad Builder

## Purpose

Allow the delivery lead to build and confirm a proposed squad from the ranked recommendations.

---

## UI Elements

| Element                     | Type         | Location           | Behaviour                                    |
|-----------------------------|--------------|--------------------|----------------------------------------------|
| Assign to Squad button      | Button       | Candidate card     | Appends candidate to squad array             |
| Proposed Squad footer tray  | Fixed footer | Bottom of viewport | Shows assigned candidates                    |
| Selected candidate avatars  | Avatar stack | Footer tray        | Overlapping circles, max 3 + "+N"            |
| Filled seats counter        | Text         | Footer tray        | "{N} of {total} seats filled"                |
| Remove candidate action     | Button (×)   | Footer tray item   | Removes candidate from squad                 |
| Reset Proposal button       | Secondary btn| Footer tray        | Clears entire squad after confirmation       |
| Export Spec button          | Secondary btn| Footer tray        | Exports squad summary (disabled if empty)    |
| Finalize Squad button       | Primary btn  | Footer tray        | Shows confirmation (disabled if empty)       |

---

## Proposed Squad State

```ts
interface ProposedSquadState {
  projectCode: string;
  squadIntent: string;
  totalSeats: number;           // default: 5
  members: ScoredCandidate[];   // assigned candidates
}
```

---

## Proposed Squad Data Shape (for API/export)

```json
{
  "projectCode": "ZAF-2024-081",
  "squadIntent": "Retail Banking App Refactor",
  "filledSeats": 3,
  "squadMembers": [
    {
      "id": "EMP-001",
      "name": "Thabo Mokoena",
      "primaryRole": "Frontend Engineer",
      "suitabilityScore": 87.67
    }
  ]
}
```

---

## Behaviour Rules

| Action                  | Rule                                                                       |
|-------------------------|----------------------------------------------------------------------------|
| Assign to Squad         | Append candidate. If already exists in array → prevent, show "Already assigned" badge on card. |
| Remove candidate        | Filter candidate out of members array. Update filled seats counter.        |
| Reset Proposal          | Show confirmation dialog. On confirm → `members = []`.                     |
| Finalize Squad          | DISABLED if `members.length === 0`. On click → show confirmation summary modal with all candidates + scores. |
| Export Spec             | DISABLED if `members.length === 0`. Generate text/JSON summary for clipboard or download. |
| Filled seats counter    | Always shows `{members.length} of {totalSeats} seats filled ({percentage}%)`. |

---

## Duplicate Prevention

When a candidate is already in the squad:
- "Assign to Squad" button on their card becomes DISABLED
- Button text changes to "Already Assigned"
- Button style: `bg-slate-300 text-slate-500 cursor-not-allowed`

---

## Confirmation Summary Modal

On "Finalize Squad" click:

```
┌─────────────────────────────────────────┐
│ ✅ Finalize Squad?                       │
│                                         │
│ Project: ZAF-2024-081                   │
│ Intent: Retail Banking App Refactor     │
│ Members: 3 of 5 seats filled            │
│                                         │
│ • Thabo Mokoena (87.67%)               │
│ • Sarah Jenkins (82.40%)               │
│ • Liam Naidoo (76.50%)                 │
│                                         │
│ [Cancel]              [Confirm & Save]   │
└─────────────────────────────────────────┘
```

---

## Tech Alignment

- State: React Context + `useReducer` (shared across page)
- Footer: `position: fixed`, `bottom: 0`, Tailwind classes only
- No external state libraries
- Duplicate check: `members.some(m => m.candidateId === id)`
