import { Router, Request, Response } from 'express';

const router = Router();

router.get('/info', (_req: Request, res: Response): void => {
  res.json({
    name: 'SquadForge API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

export { router as infoRouter };
