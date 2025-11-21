import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import registerRoutes from './register.routes';
import customerRoutes from './customer.routes';
import partnerRoutes from './partner.routes';
import partnerAuthRoutes from './partner-auth.routes';
import documentRoutes from './document.routes';
import consentRoutes from './consent.routes';
import uploadRoutes from './upload.routes';

const router = Router();

// Mount routes - Order matters! More specific routes first
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/register', registerRoutes);
router.use('/customers', customerRoutes);
router.use('/partners', partnerRoutes);
router.use('/partner', partnerAuthRoutes);
router.use('/', consentRoutes); // Consent routes (includes /customer/consent and /partner/consent paths)
router.use('/customer', documentRoutes); // Customer document routes (must come after consent routes)

// Add more routes here
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;
