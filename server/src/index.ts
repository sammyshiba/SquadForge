import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { healthRouter } from './routes/health.js';
import { infoRouter } from './routes/info.js';
import { echoRouter } from './routes/echo.js';
import { demandRouter } from './routes/demand.js';
import { squadRouter } from './routes/squads.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(healthRouter);
app.use('/api', infoRouter);
app.use('/api', echoRouter);
app.use('/api', demandRouter);
app.use('/api', squadRouter);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
});

export { app };
