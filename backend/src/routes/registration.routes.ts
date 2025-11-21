import { Router } from 'express';
import { registrationController } from '../controllers/registration.controller';
import { validateCustomer, validatePartner } from '../middleware/validation';

const router = Router();

// Customer registration
router.post('/customer', validateCustomer, registrationController.registerCustomer);

// Partner registration
router.post('/partner', validatePartner, registrationController.registerPartner);

export default router;
