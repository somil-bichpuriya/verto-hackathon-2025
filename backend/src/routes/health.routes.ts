import { Router } from 'express';
import { healthController } from '../controllers/health.controller';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', healthController.check);
router.get('/detailed', asyncHandler(healthController.detailed.bind(healthController)));

export default router;
