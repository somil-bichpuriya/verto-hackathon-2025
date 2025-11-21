import { Router } from 'express';
import { uploadDocument, getMyDocuments } from '../controllers/document.controller';
import { authenticate, requireCustomer } from '../middleware/auth.middleware';

const router = Router();

// All routes require JWT customer authentication
router.use(authenticate);
router.use(requireCustomer);

router.post('/documents', uploadDocument);
router.get('/documents', getMyDocuments);

export default router;
