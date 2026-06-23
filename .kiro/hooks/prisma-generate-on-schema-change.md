# Hook: Prisma Generate on Schema Change

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "prisma-generate",
  "name": "Prisma Generate on Schema Change",
  "description": "Automatically regenerates Prisma Client when schema.prisma is edited, ensuring types stay in sync with the database schema.",
  "eventType": "fileEdited",
  "hookAction": "runCommand",
  "command": "npx prisma generate --schema=server/prisma/schema.prisma",
  "filePatterns": "**/schema.prisma"
}
```

## Purpose

- Keeps Prisma Client types in sync with schema changes.
- Eliminates the common "Cannot find module '@prisma/client'" error after schema edits.
- Runs automatically so developers don't forget the generate step.

## Dependencies

- Prisma must be installed (`devDependencies`)
- `schema.prisma` must exist at the configured path
