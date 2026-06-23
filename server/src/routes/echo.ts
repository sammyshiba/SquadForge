import { Router, Request, Response } from 'express';

const router = Router();

router.post('/echo', (req: Request, res: Response): void => {
  res.json({
    ...req.body,
    timestamp: new Date().toISOString(),
  });
});

export { router as echoRouter };
