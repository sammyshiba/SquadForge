# Hook: No Default Exports

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "no-default-exports",
  "name": "No Default Exports",
  "description": "Before writing any TypeScript file, verifies the agent is not introducing export default. All exports must be named exports per project conventions.",
  "eventType": "preToolUse",
  "hookAction": "askAgent",
  "outputPrompt": "Before writing this file, verify it does NOT contain 'export default'. All exports MUST be named exports (e.g., export const, export function, export interface). If you find 'export default' in your planned write, replace it with a named export before proceeding.",
  "toolTypes": "write"
}
```

## Purpose

- Enforces RULE 2 from conventions.md: NEVER use default exports.
- Catches violations before they are written to disk.
- Applies to all write operations on any file type.

## Dependencies

- None — this is a pre-write validation check.
