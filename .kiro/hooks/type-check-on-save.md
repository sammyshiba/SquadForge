# Hook: Type Check on Save

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "type-check-on-save",
  "name": "Type Check on Save",
  "description": "Runs TypeScript compiler in no-emit mode when TypeScript files are saved, catching type errors that ESLint does not cover.",
  "eventType": "fileEdited",
  "hookAction": "runCommand",
  "command": "npx tsc --noEmit",
  "filePatterns": "**/*.ts, **/*.tsx"
}
```

## Purpose

- Catches type errors beyond what ESLint reports (strict mode violations, missing return types, incorrect generics).
- Runs project-wide type check to catch cross-file breakages.
- Complements lint-on-save by covering the type system layer.

## Dependencies

- TypeScript must be installed
- `tsconfig.json` must exist at workspace root (or in each package)
