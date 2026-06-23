---
inclusion: manual
---

# Scoring Logic Reference

All suitability scoring MUST be rules-based weighted arithmetic. No AI/ML libraries.

## Formula

```
S_Total = (0.50 × S_Skill) + (0.30 × S_Avail) + (0.20 × S_Role)
```

| Factor           | Weight | Range  |
|------------------|--------|--------|
| Skill Match      | 50%    | 0–100  |
| Availability     | 30%    | 0–100  |
| Role Alignment   | 20%    | 0–100  |

Total score is the weighted sum rounded to 2 decimal places.

## Scoring Functions

All scoring functions MUST be:
- **Pure** — no side effects, no database calls
- **Independently testable** — accept data in, return number out
- Located in `packages/backend/src/services/scoring-service.ts`

### Skill Score

- For each required skill, check if the candidate has it
- Level >= 4 → 100 points for that skill
- Level < 4 → 80 points
- Skill not found → 0 points
- Average across all required skills

### Availability Score

- 0% allocated → 100
- 1–50% allocated → 70
- 51%+ allocated → 20

### Role Score

- Exact role match → 100
- No match → 0

## Example

```ts
// (0.50 × 93.33) + (0.30 × 70) + (0.20 × 100) = 87.67
calculateTotalScore(93.33, 70, 100) // → 87.67
```
