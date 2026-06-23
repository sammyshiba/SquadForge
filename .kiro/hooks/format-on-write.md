# Hook: Format on Write

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "format-on-write",
  "name": "Format on Write",
  "description": "Runs Prettier on TypeScript and JSON files after they are edited to ensure consistent formatting.",
  "eventType": "fileEdited",
  "hookAction": "runCommand",
  "command": "npx prettier --write --ignore-unknown",
  "filePatterns": "**/*.ts, **/*.tsx, **/*.json"
}
```

## Purpose

- Ensures consistent code formatting across the project.
- Uses the project's `.prettierrc.json` configuration.
- Complements ESLint by handling pure formatting concerns.

## Dependencies

- Prettier must be installed (root `devDependencies`)
- `.prettierrc.json` must exist at workspace root
- `.prettierignore` must exist to exclude build artifacts
