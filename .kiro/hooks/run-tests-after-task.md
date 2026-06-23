# Hook: Run Tests After Task

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "run-tests-after-task",
  "name": "Run Tests After Task",
  "description": "After a spec task is completed, runs the full test suite to verify nothing is broken.",
  "eventType": "postTaskExecution",
  "hookAction": "runCommand",
  "command": "npm run test --workspaces --if-present"
}
```

## Purpose

- Verifies implementation correctness after each spec task completes.
- Catches regressions introduced during task execution.
- Runs tests across all workspaces that have a test script defined.

## Dependencies

- Vitest must be installed in relevant workspaces
- Each workspace must have a `test` script in `package.json`
