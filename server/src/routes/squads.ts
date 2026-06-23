import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prisma.js';

import type { Request, Response } from 'express';

const router = Router();

const CreateSquadSchema = z.object({
  demandId: z.string().min(1, 'Demand ID is required.'),
  squadName: z.string().min(1, 'Squad name is required.'),
});

const AssignMemberSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required.'),
});

const UpdateStatusSchema = z.object({
  status: z.enum(['FINALIZED', 'ABANDONED']),
});

// POST /api/squads — Create a new draft squad
router.post('/squads', async (req: Request, res: Response) => {
  try {
    const parsed = CreateSquadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: { code: 'VALIDATION_FAILED', message: parsed.error.errors.map((e) => e.message).join(', ') },
      });
      return;
    }

    const { demandId, squadName } = parsed.data;

    const demand = await prisma.demandRequest.findUnique({ where: { id: demandId } });
    if (!demand) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Demand request not found.' },
      });
      return;
    }

    const squad = await prisma.proposedSquad.create({
      data: { demandId, squadName, status: 'DRAFT' },
    });

    res.status(201).json({
      data: { id: squad.id, squadName: squad.squadName, demandId: squad.demandId, status: squad.status, filledSeats: 0 },
    });
  } catch (error) {
    console.error('[POST /api/squads] Failed to create squad:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create squad.' },
    });
  }
});

// GET /api/squads/:id — Get squad with members
router.get('/squads/:id', async (req: Request, res: Response) => {
  try {
    const squad = await prisma.proposedSquad.findUnique({
      where: { id: req.params.id },
      include: {
        members: {
          include: { employee: true },
        },
      },
    });

    if (!squad) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Squad not found.' },
      });
      return;
    }

    const members = squad.members.map((m) => ({
      employeeId: m.employeeId,
      name: m.employee.fullName,
      primaryRole: m.employee.primaryRole,
      assignedDate: m.assignedDate,
    }));

    res.status(200).json({
      data: {
        id: squad.id,
        squadName: squad.squadName,
        demandId: squad.demandId,
        status: squad.status,
        filledSeats: members.length,
        members,
        createdAt: squad.createdAt,
        updatedAt: squad.updatedAt,
      },
    });
  } catch (error) {
    console.error('[GET /api/squads/:id] Failed to fetch squad:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch squad.' },
    });
  }
});

// POST /api/squads/:id/members — Assign employee to squad
router.post('/squads/:id/members', async (req: Request, res: Response) => {
  try {
    const parsed = AssignMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: { code: 'VALIDATION_FAILED', message: parsed.error.errors.map((e) => e.message).join(', ') },
      });
      return;
    }

    const { employeeId } = parsed.data;
    const squadId = req.params.id;

    const squad = await prisma.proposedSquad.findUnique({ where: { id: squadId } });
    if (!squad) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Squad not found.' },
      });
      return;
    }

    if (squad.status === 'FINALIZED') {
      res.status(409).json({
        error: { code: 'SQUAD_FINALIZED', message: 'Cannot modify a finalized squad.' },
      });
      return;
    }

    const membership = await prisma.squadMembership.create({
      data: { squadId, employeeId },
    });

    const memberCount = await prisma.squadMembership.count({ where: { squadId } });

    res.status(201).json({
      data: { squadId: membership.squadId, employeeId: membership.employeeId, filledSeats: memberCount },
    });
  } catch (error) {
    // Handle unique constraint violation (P2002)
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      res.status(409).json({
        error: { code: 'ALREADY_ASSIGNED', message: 'Employee is already a member of this squad.' },
      });
      return;
    }
    console.error('[POST /api/squads/:id/members] Failed to assign member:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to assign member.' },
    });
  }
});

// DELETE /api/squads/:id/members/:employeeId — Remove member
router.delete('/squads/:id/members/:employeeId', async (req: Request, res: Response) => {
  try {
    const { id: squadId, employeeId } = req.params;

    const membership = await prisma.squadMembership.findUnique({
      where: { squadId_employeeId: { squadId, employeeId } },
    });

    if (!membership) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Membership not found.' },
      });
      return;
    }

    await prisma.squadMembership.delete({
      where: { squadId_employeeId: { squadId, employeeId } },
    });

    res.status(204).send();
  } catch (error) {
    console.error('[DELETE /api/squads/:id/members/:employeeId] Failed to remove member:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to remove member.' },
    });
  }
});

// PATCH /api/squads/:id/status — Update squad status (finalize/abandon)
router.patch('/squads/:id/status', async (req: Request, res: Response) => {
  try {
    const parsed = UpdateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: { code: 'VALIDATION_FAILED', message: parsed.error.errors.map((e) => e.message).join(', ') },
      });
      return;
    }

    const { status } = parsed.data;
    const squadId = req.params.id;

    const squad = await prisma.proposedSquad.findUnique({
      where: { id: squadId },
      include: { members: true },
    });

    if (!squad) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Squad not found.' },
      });
      return;
    }

    if (status === 'FINALIZED' && squad.members.length === 0) {
      res.status(400).json({
        error: { code: 'EMPTY_SQUAD', message: 'Cannot finalize an empty squad' },
      });
      return;
    }

    const updated = await prisma.proposedSquad.update({
      where: { id: squadId },
      data: { status },
      include: {
        members: { include: { employee: true } },
      },
    });

    const members = updated.members.map((m) => ({
      employeeId: m.employeeId,
      name: m.employee.fullName,
      primaryRole: m.employee.primaryRole,
      assignedDate: m.assignedDate,
    }));

    res.status(200).json({
      data: {
        id: updated.id,
        squadName: updated.squadName,
        demandId: updated.demandId,
        status: updated.status,
        filledSeats: members.length,
        members,
      },
    });
  } catch (error) {
    console.error('[PATCH /api/squads/:id/status] Failed to update status:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update squad status.' },
    });
  }
});

// POST /api/squads/:id/reset — Clear all members
router.post('/squads/:id/reset', async (req: Request, res: Response) => {
  try {
    const squadId = req.params.id;

    const squad = await prisma.proposedSquad.findUnique({ where: { id: squadId } });
    if (!squad) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Squad not found.' },
      });
      return;
    }

    await prisma.squadMembership.deleteMany({ where: { squadId } });

    res.status(200).json({
      data: { id: squadId, filledSeats: 0 },
    });
  } catch (error) {
    console.error('[POST /api/squads/:id/reset] Failed to reset squad:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to reset squad.' },
    });
  }
});

// GET /api/squads/:id/export — Export squad summary
router.get('/squads/:id/export', async (req: Request, res: Response) => {
  try {
    const squad = await prisma.proposedSquad.findUnique({
      where: { id: req.params.id },
      include: {
        demand: true,
        members: {
          include: {
            employee: {
              include: { skills: true },
            },
          },
        },
      },
    });

    if (!squad) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Squad not found.' },
      });
      return;
    }

    // Look up scoring results for squad members against this demand
    const memberScores = await prisma.scoringResult.findMany({
      where: {
        demandId: squad.demandId,
        employeeId: { in: squad.members.map((m) => m.employeeId) },
      },
    });

    const scoreMap = new Map(memberScores.map((s) => [s.employeeId, s.sTotal * 100]));

    const members = squad.members.map((m) => ({
      employeeId: m.employeeId,
      name: m.employee.fullName,
      primaryRole: m.employee.primaryRole,
      sTotal: scoreMap.get(m.employeeId) ?? 0,
    }));

    res.status(200).json({
      data: {
        projectCode: squad.demand.projectCode,
        businessDomain: squad.demand.businessDomain,
        squadIntent: squad.demand.squadIntent,
        squadName: squad.squadName,
        filledSeats: members.length,
        members,
      },
    });
  } catch (error) {
    console.error('[GET /api/squads/:id/export] Failed to export squad:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to export squad.' },
    });
  }
});

export { router as squadRouter };
