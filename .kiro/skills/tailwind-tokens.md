---
inclusion: manual
---

# Tailwind Design Tokens

Reference for project-specific design tokens. Extend in `tailwind.config.ts`.

## Colour Palette

| Token          | Value     | Usage                        |
|----------------|-----------|------------------------------|
| primary        | blue-800  | CTAs, active states          |
| primary-hover  | blue-700  | Button hover                 |
| surface        | white     | Card backgrounds             |
| background     | slate-50  | Page background              |
| border         | slate-200 | Card borders, dividers       |
| text-primary   | slate-900 | Headings, body text          |
| text-secondary | slate-500 | Supporting text, labels      |
| success        | green-600 | High scores, available       |
| warning        | amber-600 | Medium scores, partial       |
| danger         | red-600   | Low scores, unavailable      |

## Typography Scale

- Page title: `text-2xl font-bold text-slate-900`
- Section heading: `text-lg font-semibold text-slate-900`
- Card title: `text-base font-semibold text-slate-900`
- Body: `text-sm text-slate-700`
- Caption/label: `text-xs text-slate-500`

## Spacing

- Page padding: `p-6`
- Card padding: `p-4`
- Section gap: `space-y-6`
- Component gap: `space-y-4` or `gap-4`

## Component Patterns

### Card
```
bg-white rounded-xl shadow-sm border border-slate-200 p-4
```

### Primary Button
```
flex items-center justify-center w-full h-12 px-4 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-lg
```

### Badge
```
inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
```

### Score Colours (conditional)
```ts
clsx({
  'text-green-600': score >= 80,
  'text-amber-600': score >= 60 && score < 80,
  'text-red-600': score < 60,
})
```

## Rules

- Tailwind utility classes ONLY — no CSS modules or styled-components
- Class order: layout → sizing → spacing → typography → colours → effects
- Use `clsx` for conditional classes
- Colour alone is never sufficient — always include text label for accessibility
