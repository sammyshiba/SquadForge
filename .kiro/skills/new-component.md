---
inclusion: manual
---

# New React Component Checklist

Follow this when creating a new React component.

## File Setup

- Place in `packages/frontend/src/components/` (reusable) or `packages/frontend/src/pages/` (route-level)
- Filename MUST match component name in PascalCase (e.g., `CandidateCard.tsx`)
- One component per file

## Template

```tsx
interface MyComponentProps {
  // Define typed props
}

export const MyComponent = ({ ...props }: MyComponentProps): JSX.Element => {
  return (
    <div className="...">
      {/* content */}
    </div>
  );
};
```

## Rules

- Functional components ONLY — no class components
- Named exports ONLY — no default exports
- Define props with `interface {Component}Props`
- Destructure props in function parameter
- Maximum 150 lines — extract sub-components if longer
- Tailwind utility classes ONLY — no CSS modules, styled-components, or inline styles
- Use `clsx` or `cn` helper for conditional classes
- Class order: layout → sizing → spacing → typography → colours → effects
- Semantic HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
- Icon-only buttons MUST have `aria-label`
- Custom hooks go in adjacent `use{Feature}.ts` file

## State Management

- Use `useState`, `useReducer`, `useContext` — no external state libraries
- Lift state to nearest common ancestor
- Do not prop-drill beyond 2 levels — use Context instead
