# Hook: Test on Create

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "test-on-create",
  "name": "Test on Create",
  "description": "When a new source file is created, prompts the agent to create a corresponding test file following project testing conventions.",
  "eventType": "fileCreated",
  "hookAction": "askAgent",
  "outputPrompt": "A new source file was created. Create a corresponding test file using Vitest (describe, it, expect). Follow conventions.md RULE 7: co-locate with source using {filename}.test.ts naming. Use named imports, test the exported functions, and include at least one happy-path and one edge-case test.",
  "filePatterns": "**/src/**/*.ts, **/src/**/*.tsx"
}
```

## Purpose

- Ensures every new source file gets a test file automatically.
- Agent creates tests that follow project conventions (Vitest, not Jest).
- Only triggers for files in `src/` directories — ignores config files, tests themselves, etc.

## Dependencies

- Vitest must be installed in the relevant workspace
- `vitest.config.ts` must exist in the workspace
