import { Router } from 'express';
import { uploadController, upload } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// Single file upload
router.post('/', upload.single('file'), uploadController.uploadFile);

// Multiple files upload
router.post('/multiple', upload.array('files', 10), uploadController.uploadMultipleFiles);

export default router;
