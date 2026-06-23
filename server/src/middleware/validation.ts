import { z } from 'zod';

import type { Request, Response, NextFunction } from 'express';

export const DemandRequestSchema = z.object({
  squadIntent: z.string().min(1, 'Enter a squad intent.'),
  projectCode: z.string().min(1, 'Enter a project code.'),
  requiredRole: z.enum(['FRONTEND', 'BACKEND', 'FULLSTACK', 'DESIGN', 'QA', 'DATA', 'PLATFORM']),
  requiredSkills: z.array(z.string()).min(1, 'Add at least one required competency.'),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  durationWeeks: z.number().positive('Enter an expected duration.'),
  businessDomain: z.string().min(1, 'Select a business domain.'),
});

export const ScoreRequestSchema = z.object({
  demandId: z.string().min(1, 'Demand ID is required.'),
});

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_FAILED',
          message: result.error.errors.map((e) => e.message).join(', '),
          details: result.error.errors,
        },
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
