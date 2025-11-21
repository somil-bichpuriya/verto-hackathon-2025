import { Router } from 'express';
import {
  generateConsent,
  viewConsent,
  grantConsentAction,
} from '../controllers/consent.controller';
import { authenticatePartner } from '../middleware/partnerAuth';

const router = Router();

// Partner generates consent request (requires partner auth)
router.post('/partner/consent/generate', authenticatePartner, generateConsent);

// Customer views consent details (public - only token needed)
router.get('/customer/consent/:token', viewConsent);

// Customer grants consent (public - only token needed)
router.post('/customer/consent/:token/grant', grantConsentAction);

export default router;
