import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';

const router = Router();
const analysisController = new AnalysisController();

router.post('/analyze', analysisController.analyzeResume.bind(analysisController));
router.get('/highlights', analysisController.getHighlights.bind(analysisController));
router.get('/summary', analysisController.getSummary.bind(analysisController));

export default router;