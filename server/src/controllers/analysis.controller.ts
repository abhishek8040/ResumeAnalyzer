import { Request, Response } from 'express';
import { analyzeText } from '../services/resumeAnalysis';
import { extractKeywords } from '../services/keywordExtractor';
import { generateSummary } from '../services/summaryGenerator';

export class AnalysisController {
    public async analyzeResume(req: Request, res: Response): Promise<void> {
        try {
            const { text, jobTitle, jobSkills } = req.body || {};
            if (!text || typeof text !== 'string') {
                res.status(400).json({ message: 'Missing required field: text' });
                return;
            }

            const result = await analyzeText(text, { jobTitle, jobSkills });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error analyzing resume', error: (error as Error).message });
        }
    }

    public async getHighlights(req: Request, res: Response): Promise<void> {
        try {
            const text = (req.query.text as string) || '';
            if (!text) {
                res.status(400).json({ message: 'Query param "text" is required' });
                return;
            }
            const keywords = extractKeywords(text);
            res.status(200).json({ keywords });
        } catch (error) {
            res.status(500).json({ message: 'Error extracting highlights', error: (error as Error).message });
        }
    }

    public async getSummary(req: Request, res: Response): Promise<void> {
        try {
            const text = (req.query.text as string) || '';
            if (!text) {
                res.status(400).json({ message: 'Query param "text" is required' });
                return;
            }
            const summary = generateSummary(text);
            res.status(200).json({ summary });
        } catch (error) {
            res.status(500).json({ message: 'Error generating summary', error: (error as Error).message });
        }
    }
}