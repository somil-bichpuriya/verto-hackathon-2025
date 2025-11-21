import { Router } from 'express';
import { partnerController } from '../controllers/partner.controller';
import { authenticate, requirePartner } from '../middleware/auth.middleware';

const router = Router();

// Authenticated partner routes (JWT-based)
router.get('/me/document-types', authenticate, requirePartner, partnerController.getMyDocumentTypes);
router.put('/me/document-types', authenticate, requirePartner, partnerController.updateMyDocumentTypes);

// Partner routes (public/admin)
router.get('/:id', partnerController.getPartnerById);
router.put('/:id/document-types', partnerController.updateDocumentTypes);

export default router;
