import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);

// Add more routes here
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;
