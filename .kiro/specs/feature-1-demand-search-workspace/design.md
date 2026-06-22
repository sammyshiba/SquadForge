# DESIGN — Feature 1: Demand & Search Workspace

## Purpose

This feature allows the delivery lead to capture the delivery need and trigger candidate matching from a mock internal talent pool.

---

## UI Elements

| Element                        | Type        | Behaviour                                             |
|--------------------------------|-------------|-------------------------------------------------------|
| Squad Intent                   | Text input  | Free text describing the delivery need                |
| Project Code                   | Text input  | Format: `ZAF-YYYY-NNN`                               |
| Priority Level                 | Dropdown    | Options: Urgent - Regulatory, High, Medium, Low       |
| Required Role                  | Dropdown    | Single selection from role list                       |
| Required Skills                | Tag selector| Multi-select with dismiss (×) and "+ Add Skill"      |
| Expected Duration              | Number input| Weeks, must be > 0                                   |
| Business Domain                | Dropdown    | Single selection from domain list                     |
| Generate Recommendations       | Button      | Triggers scoring; disabled until form is valid        |
| Recommendation Queue           | Card grid   | Displays ranked candidates after generation           |

---

## Demand Data Shape

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

---

## Validation Rules

| Field            | Rule                                  | Error Message                                |
|------------------|---------------------------------------|----------------------------------------------|
| Required Role    | MUST be selected                      | "Required role is missing"                   |
| Required Skills  | At least 1 skill MUST be selected     | "At least one skill is required"             |
| Expected Duration| MUST be > 0                           | "Duration must be greater than 0"            |
| Project Code     | MUST not be empty                     | "Project code is required"                   |

---

## Behaviour

1. The Generate Recommendations button is DISABLED until all validation rules pass.
2. On valid submission: POST demand criteria → execute scoring algorithm → populate Recommendation Queue.
3. On any field change AFTER recommendations exist: recalculate and re-sort immediately (debounce 300ms).
4. ALL candidate data comes from mock data only. ZERO external API calls.

---

## Tech Alignment

- React functional component with `useState` / `useReducer`
- Tailwind CSS utility classes only
- Zod validation on form state
- Mock data in `packages/backend/src/data/` or `packages/frontend/src/data/`
