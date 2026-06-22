# Hook: Lint on Save

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "lint-on-save",
  "name": "Lint on Save",
  "description": "Runs ESLint with auto-fix on any TypeScript file when saved and reports remaining errors for resolution.",
  "eventType": "fileEdited",
  "hookAction": "runCommand",
  "command": "npx eslint --fix --no-warn-ignored",
  "filePatterns": "**/*.ts, **/*.tsx"
}
```

## Purpose

- Auto-fixes formatting, unused imports, and simple lint violations on save.
- Reports remaining unfixable errors back to the agent for manual resolution.
- Uses the project's `eslint.config.mjs` flat config at the workspace root.

## Dependencies

- ESLint must be installed (root `package.json` devDependencies)
- `eslint.config.mjs` must exist at workspace root
