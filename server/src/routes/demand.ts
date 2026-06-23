import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import {
  calculateSkillScore,
  calculateAvailabilityScore,
  calculateRoleScore,
  calculateTotalScore,
  generateReason,
} from '../services/scoring-service.js';
import { validate, DemandRequestSchema, ScoreRequestSchema } from '../middleware/validation.js';

import type { Request, Response } from 'express';

const router = Router();

// POST /api/demands — create a new demand request
router.post('/demands', validate(DemandRequestSchema), async (req: Request, res: Response) => {
  try {
    const { requiredSkills, ...rest } = req.body;

    const demand = await prisma.demandRequest.create({
      data: {
        ...rest,
        requiredSkills: requiredSkills.join(','),
      },
    });

    res.status(201).json({ data: demand });
  } catch (error) {
    console.error('[POST /api/demands] Failed to create demand:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create demand request.' },
    });
  }
});

// POST /api/score — score candidates against a demand
router.post('/score', validate(ScoreRequestSchema), async (req: Request, res: Response) => {
  try {
    const { demandId } = req.body;

    const demand = await prisma.demandRequest.findUnique({ where: { id: demandId } });
    if (!demand) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Demand request not found.' },
      });
      return;
    }

    const requiredSkills = demand.requiredSkills.split(',').map((s) => s.trim());

    const employees = await prisma.employeeProfile.findMany({
      include: { skills: true },
    });

    // Calculate scores for each employee
    const scored = employees.map((employee) => {
      const sSkill = calculateSkillScore(requiredSkills, employee.skills);
      const sAvail = calculateAvailabilityScore(employee.currentAllocationPercentage);
      const sRole = calculateRoleScore(demand.requiredRole, employee.primaryRole);
      const sTotal = calculateTotalScore(sSkill, sAvail, sRole);
      const reason = generateReason(sSkill, sAvail, sRole);

      return {
        employeeId: employee.id,
        fullName: employee.fullName,
        primaryRole: employee.primaryRole,
        currentAllocationPercentage: employee.currentAllocationPercentage,
        availabilityDate: employee.availabilityDate,
        skills: employee.skills,
        sSkill,
        sAvail,
        sRole,
        sTotal,
        reason,
      };
    });

    // Sort: descending by sTotal, tie-break by availabilityDate ascending, then id
    scored.sort((a, b) => {
      if (b.sTotal !== a.sTotal) return b.sTotal - a.sTotal;
      const dateA = new Date(a.availabilityDate).getTime();
      const dateB = new Date(b.availabilityDate).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.employeeId.localeCompare(b.employeeId);
    });

    // Delete old scoring results for this demand before inserting new ones
    await prisma.scoringResult.deleteMany({ where: { demandId } });

    // Persist scoring results
    const scoringResults = scored.map((s, index) => ({
      demandId,
      employeeId: s.employeeId,
      sTotal: s.sTotal / 100,
      sSkill: s.sSkill / 100,
      sAvail: s.sAvail / 100,
      sRole: s.sRole / 100,
      rank: index + 1,
      reason: s.reason,
    }));

    await prisma.scoringResult.createMany({ data: scoringResults });

    const ranked = scored.map((s, index) => ({
      rank: index + 1,
      employeeId: s.employeeId,
      fullName: s.fullName,
      primaryRole: s.primaryRole,
      currentAllocationPercentage: s.currentAllocationPercentage,
      availabilityDate: s.availabilityDate,
      skills: s.skills,
      sSkill: s.sSkill,
      sAvail: s.sAvail,
      sRole: s.sRole,
      sTotal: s.sTotal,
      reason: s.reason,
    }));

    res.status(200).json({ data: { demandId, ranked } });
  } catch (error) {
    console.error('[POST /api/score] Failed to score candidates:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to score candidates.' },
    });
  }
});

// GET /api/employees — list all employees with skills
router.get('/employees', async (_req: Request, res: Response) => {
  try {
    const employees = await prisma.employeeProfile.findMany({
      include: { skills: true },
    });

    res.status(200).json({ data: employees });
  } catch (error) {
    console.error('[GET /api/employees] Failed to fetch employees:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch employees.' },
    });
  }
});

export { router as demandRouter };
