import type { Express } from 'express';
import analysisRoutes from './analysis.routes';
import uploadRoutes from './upload.routes';

export const setupRoutes = (app: Express) => {
    // Mount routers directly under /api to match client expectations
    app.use('/api', analysisRoutes);
    app.use('/api', uploadRoutes);
};