# Product Context

## SETUP ORDER — READ THIS FIRST

When building or scaffolding this project, you MUST follow this order:

1. **Register hooks FIRST** — Read all `.md` files in `.kiro/hooks/` and execute their `INSTRUCTION TO AGENT` sections BEFORE writing any application code.
2. **Then implement application code** — Follow specs in `docs/` and `.kiro/specs/`.

This ensures hooks (lint-on-save, test-on-create) are active BEFORE any source files are created or edited.

---

## What It Does

An internal prototype tool that helps delivery leads and team facilitators at Standard Bank rapidly assemble cross-functional squads for priority initiatives. Given a specific delivery need, the system answers: "Who are the best available people to help right now?"

## Core Journey

A delivery lead captures a work request (specifying required skills, urgency, and expected duration) and receives a ranked shortlist of recommended internal candidates. Each recommendation explains why the person is suggested, and the user can select candidates to form a proposed squad.

## Who It's For

- **Primary users:** Delivery leads and team facilitators who need to mobilise squads quickly
- **Beneficiaries:** The broader organisation — reducing delays, improving resource visibility, and enabling better staffing decisions

## Key Goals

1. **Speed** — Reduce the time it takes to identify the right people for a piece of work
2. **Transparency** — Show clearly why each candidate is recommended (skill match, availability, role alignment, workload)
3. **Repeatability** — Replace manual, relationship-driven staffing with a consistent, rules-based approach
4. **Usability** — Provide an intuitive, focused user flow scoped to a single practical journey

## Constraints

- Mock employee, skill, and availability data only (no real HR/calendar/identity integrations)
- Simple rules-based scoring (no AI/ML)
- Scoped to one business unit or sample internal talent pool
- Availability represented as simple capacity indicators (percentage allocation or bands)
- Lightweight prototype, not a full enterprise staffing solution

## Business Context

In a large enterprise like Standard Bank, critical work depends on quickly finding the right contributors across architecture, engineering, testing, data, and delivery disciplines. Manual identification creates delays, uneven workloads, and poor visibility of available skills. This tool addresses that gap with a focused, practical solution.
