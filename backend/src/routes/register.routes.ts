import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';
import { partnerController } from '../controllers/partner.controller';
import { validateCustomer, validatePartner } from '../middleware/validation';

const router = Router();

// Registration routes
router.post('/customer', validateCustomer, customerController.registerCustomer);
router.post('/partner', validatePartner, partnerController.registerPartner);

export default router;
