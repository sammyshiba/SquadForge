# DESIGN — Feature 3: Candidate Profile Breakdown

## Purpose

Make recommendations transparent by showing why each candidate received their suitability score.

---

## Candidate Card Content

| Element                      | Type          | Always Visible |
|------------------------------|---------------|:--------------:|
| Avatar                       | Image (48×48) | ✅             |
| Name                         | Text (bold)   | ✅             |
| Primary Role                 | Text          | ✅             |
| Availability Label           | Badge         | ✅             |
| Current Allocation %         | Text/badge    | ✅             |
| Core Skills                  | Tag list      | ✅             |
| Total Suitability Score      | Circle/number | ✅             |
| Score Bars (Skill/Avail/Role)| Progress bars | ✅             |
| View Breakdown button        | Button/link   | ✅             |
| Assign to Squad button       | Button        | ✅             |

---

## Breakdown Panel (Expandable Accordion)

When "View Breakdown" is clicked, expand inline to show:

```
┌─────────────────────────────────────────┐
│ Thabo Mokoena — 87.67%                  │
│                                         │
│ Skill Match:     93.33 / 100            │
│ Availability:    70    / 100            │
│ Role Alignment:  100   / 100            │
│ Total Score:     87.67 / 100            │
│                                         │
│ Reason:                                 │
│ Strong match for React and Node, exact  │
│ role alignment, moderate allocation.    │
└─────────────────────────────────────────┘
```

---

## Availability Label Rules

| Current Allocation | Label             | Badge Style                    |
|--------------------|-------------------|--------------------------------|
| 0%                 | Available Now     | `bg-green-100 text-green-700`  |
| 1% to 50%         | Partial Capacity  | `bg-yellow-100 text-yellow-700`|
| > 50%             | Limited Capacity  | `bg-orange-100 text-orange-700`|

When allocation > 50%: MUST show "Limited Capacity" badge prominently (REQ-022).

---

## Recommendation Reason Generation

The reason text MUST be generated from scoring rules (NOT AI). Template:

```ts
const generateReason = (scored: ScoredCandidate, candidate: CandidateProfile): string => {
  const parts: string[] = [];
  if (scored.sSkill >= 80) parts.push(`Strong skill match`);
  else if (scored.sSkill >= 50) parts.push(`Moderate skill match`);
  else parts.push(`Weak skill match`);

  if (scored.sRole === 100) parts.push(`exact role alignment`);
  else parts.push(`role mismatch`);

  if (scored.sAvail === 100) parts.push(`fully available`);
  else if (scored.sAvail === 70) parts.push(`moderate allocation (${candidate.currentAllocationPercentage}%)`);
  else parts.push(`limited availability (${candidate.currentAllocationPercentage}% allocated)`);

  return parts.join(', ') + '.';
};
```

---

## Tech Alignment

- Components: `CandidateCard.tsx`, `CandidateBreakdown.tsx`, `AvailabilityBadge.tsx`, `ScoreBar.tsx`
- Tailwind utility classes only
- Accordion state: local `useState` per card (no external library)
- Score bars: Tailwind width percentages via inline `style={{ width }}` (only allowed exception per conventions.md)
