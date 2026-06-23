# Hook: Full Validation

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "full-validation",
  "name": "Full Validation",
  "description": "Manually triggered hook that runs lint, type check, and tests across the entire monorepo for a complete health check.",
  "eventType": "userTriggered",
  "hookAction": "runCommand",
  "command": "npx eslint . --no-warn-ignored && npx tsc --noEmit && npm run test --workspaces --if-present"
}
```

## Purpose

- One-click full project health check.
- Runs ESLint (all files), TypeScript compiler (type safety), and Vitest (all workspaces).
- Useful before commits, PRs, or after large refactors.

## Dependencies

- ESLint, TypeScript, and Vitest must be installed
- All workspace `package.json` files must have a `test` script
