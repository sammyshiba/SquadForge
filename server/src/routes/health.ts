import { Router, Request, Response } from 'express';

const router = Router();

const startTime = Date.now();

router.get('/health', (_req: Request, res: Response): void => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

router.get('/api/health', (_req: Request, res: Response): void => {
  const uptimeMs = Date.now() - startTime;
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptimeMs / 1000)}s`,
  });
});

export { router as healthRouter };
