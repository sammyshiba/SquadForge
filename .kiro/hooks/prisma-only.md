# Hook: Prisma Only

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "prisma-only",
  "name": "Prisma Only",
  "description": "Before writing backend source files, verifies no raw SQL is being used. All database access must go through Prisma Client.",
  "eventType": "preToolUse",
  "hookAction": "askAgent",
  "outputPrompt": "Before writing this file, verify it does NOT contain raw SQL queries. Check for: $queryRaw, $executeRaw, $queryRawUnsafe, $executeRawUnsafe, or any string that looks like a SQL statement (SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE). All database access MUST use Prisma Client methods (findMany, findUnique, create, update, delete, etc.). If raw SQL is found, rewrite using Prisma Client.",
  "toolTypes": "write"
}
```

## Purpose

- Enforces RULE 5 from conventions.md: ALWAYS use Prisma Client, NEVER raw SQL.
- Catches raw SQL before it reaches the codebase.
- Applies to all write operations.

## Dependencies

- None — this is a pre-write validation check.
