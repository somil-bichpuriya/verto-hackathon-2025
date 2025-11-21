import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route POST /api/v1/auth/customer/login
 * @desc Customer login
 * @access Public
 */
router.post('/customer/login', authController.loginCustomer);

/**
 * @route POST /api/v1/auth/partner/login
 * @desc Partner login
 * @access Public
 */
router.post('/partner/login', authController.loginPartner);

/**
 * @route POST /api/v1/auth/admin/login
 * @desc Admin login
 * @access Public
 */
router.post('/admin/login', authController.loginAdmin);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout
 * @access Private
 */
router.post('/logout', authenticate, authController.logout);

export default router;
