import { Request, Response } from 'express';
import pdf from 'pdf-parse';
import { analyzeText } from '../services/resumeAnalysis';

export class UploadController {
    public async uploadResume(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as Express.Multer.File | undefined;
            if (!file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const data = await pdf(file.buffer);
            const text = data.text || '';
            if (!text.trim()) {
                res.status(400).json({ message: 'Unable to extract text from PDF' });
                return;
            }

            const jobTitle = (req.query.jobTitle as string) || undefined;
            const jobSkills = (req.query.jobSkills as string | undefined)?.split(',').map(s => s.trim()).filter(Boolean);
            const result = await analyzeText(text, { jobTitle, jobSkills });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error processing the file', error: (error as Error).message });
        }
    }
}