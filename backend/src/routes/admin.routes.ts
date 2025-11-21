import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import {
  validateDocumentType,
  validateObjectId,
} from '../middleware/validation';

const router = Router();

// Document Type routes
router.post('/document-types', validateDocumentType, adminController.createDocumentType);
router.get('/document-types', adminController.getAllDocumentTypes);

// Customer routes
router.get('/customers', adminController.getAllCustomers);
router.get('/customers/:id', validateObjectId('id'), adminController.getCustomerById);

// Partner routes
router.get('/partners', adminController.getAllPartners);
router.get('/partners/:id', validateObjectId('id'), adminController.getPartnerById);

// Document routes
router.get('/documents/unverified', adminController.getUnverifiedDocuments);
router.get('/documents', adminController.getAllDocuments);
router.get('/documents/:id', validateObjectId('id'), adminController.getDocumentById);
router.put('/documents/:id/verify', validateObjectId('id'), adminController.verifyDocument);

// Dashboard routes
router.get('/dashboard/stats', adminController.getDashboardStats);

export default router;
