import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { uploadMiddleware } from '../middlewares/upload';

const router = Router();
const uploadController = new UploadController();

// Route for uploading resumes
router.post('/upload', uploadMiddleware, uploadController.uploadResume.bind(uploadController));

export default router;