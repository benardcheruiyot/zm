import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import withdrawRoutes from './routes/withdraw.routes.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin
  })
);
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', withdrawRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
