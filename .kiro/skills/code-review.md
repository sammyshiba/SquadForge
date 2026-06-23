---
inclusion: manual
---

# Code Review Checklist

Use this to validate code against project conventions before committing.

## TypeScript

- [ ] No `any` types without explicit justification comment
- [ ] No `var` declarations — use `const` (prefer) or `let`
- [ ] All exported functions have explicit return types
- [ ] `interface` for object shapes, `type` for unions/intersections
- [ ] No `.js` or `.jsx` files — TypeScript only

## React

- [ ] Functional components only — no class components
- [ ] Named exports only — no default exports
- [ ] One component per file
- [ ] Props defined with `interface {Component}Props`
- [ ] Component under 150 lines
- [ ] Semantic HTML elements used appropriately
- [ ] Interactive elements are keyboard navigable
- [ ] Icon-only buttons have `aria-label`

## Styling

- [ ] Tailwind utility classes only — no inline styles, CSS modules, or CSS-in-JS
- [ ] Class order: layout → sizing → spacing → typography → colours → effects
- [ ] Conditional classes use `clsx`

## API/Backend

- [ ] All route handlers are async
- [ ] Request bodies validated with Zod
- [ ] Response shape: `{ data: T }` or `{ error: { code, message } }`
- [ ] Errors propagate to global handler — no swallowed catches

## Imports

- [ ] Ordered: externals → internal absolute → relative → type-only
- [ ] Blank line between each group

## Testing

- [ ] Vitest syntax only (no Jest)
- [ ] Pure functions tested without mocks
- [ ] At least happy path + one edge case covered

## Scoring

- [ ] No AI/ML libraries imported
- [ ] Scoring functions are pure (no side effects)
- [ ] Uses standard formula: `(0.50 × Skill) + (0.30 × Avail) + (0.20 × Role)`

## General

- [ ] No swallowed errors (`catch (e) {}` is forbidden)
- [ ] No raw SQL — Prisma Client only
- [ ] Commit message format: `type: short description`
