import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock Prisma before importing the router
vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    demandRequest: {
      findUnique: vi.fn(),
    },
    proposedSquad: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    squadMembership: {
      create: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    scoringResult: {
      findMany: vi.fn(),
    },
  },
}));

// Import after mock
import { squadRouter } from '../src/routes/squads.js';
import { prisma } from '../src/lib/prisma.js';

const mockedPrisma = vi.mocked(prisma, true);

// Create a test app
const createTestApp = (): express.Application => {
  const app = express();
  app.use(express.json());
  app.use('/api', squadRouter);
  return app;
};

describe('Squad Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  describe('POST /api/squads', () => {
    it('creates a squad successfully', async () => {
      mockedPrisma.demandRequest.findUnique.mockResolvedValue({
        id: 'demand-1',
        squadIntent: 'Build feature',
        businessDomain: 'Retail',
        projectCode: 'ZAF-2024-001',
        requiredRole: 'FULLSTACK',
        requiredSkills: 'React,TypeScript',
        urgency: 'HIGH',
        durationWeeks: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.proposedSquad.create.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha Squad',
        demandId: 'demand-1',
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post('/api/squads')
        .send({ demandId: 'demand-1', squadName: 'Alpha Squad' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        data: {
          id: 'squad-1',
          squadName: 'Alpha Squad',
          demandId: 'demand-1',
          status: 'DRAFT',
          filledSeats: 0,
        },
      });
    });

    it('returns 404 for invalid demandId', async () => {
      mockedPrisma.demandRequest.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/squads')
        .send({ demandId: 'nonexistent', squadName: 'Test Squad' });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('returns 400 for invalid request body', async () => {
      const res = await request(app)
        .post('/api/squads')
        .send({ demandId: '', squadName: '' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });
  });

  describe('POST /api/squads/:id/members', () => {
    it('assigns member successfully', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha',
        demandId: 'demand-1',
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.squadMembership.create.mockResolvedValue({
        id: 'membership-1',
        squadId: 'squad-1',
        employeeId: 'emp-1',
        assignedDate: new Date(),
      });

      mockedPrisma.squadMembership.count.mockResolvedValue(1);

      const res = await request(app)
        .post('/api/squads/squad-1/members')
        .send({ employeeId: 'emp-1' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        data: { squadId: 'squad-1', employeeId: 'emp-1', filledSeats: 1 },
      });
    });

    it('returns 409 for duplicate assignment', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha',
        demandId: 'demand-1',
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const prismaError = new Error('Unique constraint failed') as Error & { code: string };
      prismaError.code = 'P2002';
      mockedPrisma.squadMembership.create.mockRejectedValue(prismaError);

      const res = await request(app)
        .post('/api/squads/squad-1/members')
        .send({ employeeId: 'emp-1' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('ALREADY_ASSIGNED');
    });

    it('returns 409 for finalized squad', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha',
        demandId: 'demand-1',
        status: 'FINALIZED',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post('/api/squads/squad-1/members')
        .send({ employeeId: 'emp-1' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('SQUAD_FINALIZED');
    });
  });

  describe('DELETE /api/squads/:id/members/:employeeId', () => {
    it('removes member successfully', async () => {
      mockedPrisma.squadMembership.findUnique.mockResolvedValue({
        id: 'membership-1',
        squadId: 'squad-1',
        employeeId: 'emp-1',
        assignedDate: new Date(),
      });

      mockedPrisma.squadMembership.delete.mockResolvedValue({
        id: 'membership-1',
        squadId: 'squad-1',
        employeeId: 'emp-1',
        assignedDate: new Date(),
      });

      const res = await request(app)
        .delete('/api/squads/squad-1/members/emp-1');

      expect(res.status).toBe(204);
    });

    it('returns 404 for non-existent membership', async () => {
      mockedPrisma.squadMembership.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/squads/squad-1/members/emp-999');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /api/squads/:id/status', () => {
    it('finalizes squad with members', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha',
        demandId: 'demand-1',
        status: 'DRAFT',
        members: [{ id: 'membership-1', squadId: 'squad-1', employeeId: 'emp-1', assignedDate: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.proposedSquad.update.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha',
        demandId: 'demand-1',
        status: 'FINALIZED',
        members: [
          {
            id: 'membership-1',
            squadId: 'squad-1',
            employeeId: 'emp-1',
            assignedDate: new Date(),
            employee: { id: 'emp-1', fullName: 'Jane Doe', primaryRole: 'FULLSTACK' },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .patch('/api/squads/squad-1/status')
        .send({ status: 'FINALIZED' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('FINALIZED');
      expect(res.body.data.filledSeats).toBe(1);
    });

    it('returns 400 for empty squad finalization', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha',
        demandId: 'demand-1',
        status: 'DRAFT',
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .patch('/api/squads/squad-1/status')
        .send({ status: 'FINALIZED' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('EMPTY_SQUAD');
    });
  });

  describe('POST /api/squads/:id/reset', () => {
    it('clears all members', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha',
        demandId: 'demand-1',
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.squadMembership.deleteMany.mockResolvedValue({ count: 3 });

      const res = await request(app)
        .post('/api/squads/squad-1/reset');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: { id: 'squad-1', filledSeats: 0 } });
    });

    it('returns 404 for non-existent squad', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/squads/nonexistent/reset');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/squads/:id/export', () => {
    it('returns correct export data', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue({
        id: 'squad-1',
        squadName: 'Alpha Squad',
        demandId: 'demand-1',
        status: 'FINALIZED',
        demand: {
          id: 'demand-1',
          projectCode: 'ZAF-2024-001',
          businessDomain: 'Retail Banking',
          squadIntent: 'Build checkout flow',
        },
        members: [
          {
            employeeId: 'emp-1',
            employee: {
              id: 'emp-1',
              fullName: 'Jane Doe',
              primaryRole: 'FULLSTACK',
              skills: [],
            },
          },
          {
            employeeId: 'emp-2',
            employee: {
              id: 'emp-2',
              fullName: 'John Smith',
              primaryRole: 'BACKEND',
              skills: [],
            },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.scoringResult.findMany.mockResolvedValue([
        { id: 'sr-1', employeeId: 'emp-1', sTotal: 0.92, demandId: 'demand-1', sSkill: 0.9, sAvail: 0.8, sRole: 1, rank: 1, reason: 'test', createdAt: new Date() },
        { id: 'sr-2', employeeId: 'emp-2', sTotal: 0.85, demandId: 'demand-1', sSkill: 0.8, sAvail: 0.7, sRole: 1, rank: 2, reason: 'test', createdAt: new Date() },
      ]);

      const res = await request(app)
        .get('/api/squads/squad-1/export');

      expect(res.status).toBe(200);
      expect(res.body.data.projectCode).toBe('ZAF-2024-001');
      expect(res.body.data.members).toHaveLength(2);
      expect(res.body.data.members[0].sTotal).toBeCloseTo(92);
      expect(res.body.data.members[1].sTotal).toBeCloseTo(85);
    });

    it('returns 404 for non-existent squad export', async () => {
      mockedPrisma.proposedSquad.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/squads/nonexistent/export');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
