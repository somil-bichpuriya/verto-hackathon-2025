import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';
import { authenticate, requireCustomer } from '../middleware/auth.middleware';

const router = Router();

// Authenticated customer routes (JWT-based)
router.get('/me/documents', authenticate, requireCustomer, customerController.getMyDocuments);

// Customer routes (public/admin)
router.get('/:id', customerController.getCustomerById);

export default router;
