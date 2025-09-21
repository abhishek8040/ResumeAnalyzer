import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setupRoutes } from './routes/index';
import errorHandler from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic health and root endpoints
app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Resume Analysis API',
        endpoints: {
            analyze: 'POST /api/analyze',
            upload: 'POST /api/upload (multipart/form-data, field: resume)',
            highlights: 'GET /api/highlights?text=...',
            summary: 'GET /api/summary?text=...',
            health: 'GET /api/health'
        }
    });
});

app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy' });
});

// Setup routes
setupRoutes(app);

// Error handler should be registered after routes
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});