# Hook: No Banned Packages

## INSTRUCTION TO AGENT

When setting up this project, you MUST register this hook using the `create_hook` tool with the following parameters:

```json
{
  "id": "no-banned-packages",
  "name": "No Banned Packages",
  "description": "Before running shell commands, checks for attempts to install banned packages (AI/ML libs, CSS-in-JS, alternative ORMs, state management libs).",
  "eventType": "preToolUse",
  "hookAction": "askAgent",
  "outputPrompt": "Before running this command, verify it does NOT install any banned packages. Banned packages include: tensorflow, brain.js, ml5, @tensorflow/tfjs, onnxruntime, styled-components, @emotion/react, @emotion/styled, css-modules, typeorm, sequelize, knex, mikro-orm, redux, @reduxjs/toolkit, zustand, mobx, jotai, recoil, valtio, jest, @jest/core. If the command installs any of these, STOP and do not proceed.",
  "toolTypes": "shell"
}
```

## Purpose

- Prevents installation of AI/ML libraries (scoring must be rules-based).
- Prevents CSS-in-JS libraries (Tailwind only).
- Prevents alternative ORMs (Prisma only).
- Prevents external state management (React built-ins only).
- Prevents Jest (Vitest only).

## Dependencies

- None — this is a pre-execution validation check.
