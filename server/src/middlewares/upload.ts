import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    upload.single('resume')(req, res, (err: any) => {
        if (err) {
            return res.status(400).json({ error: 'Error uploading file' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        next();
    });
};