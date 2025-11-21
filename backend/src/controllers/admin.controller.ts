import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { asyncHandler } from '../middleware/errorHandler';

export class AdminController {
  /**
   * POST /api/admin/document-types
   * Create a new document type
   */
  createDocumentType = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const documentType = await adminService.createDocumentType(req.body);

      res.status(201).json({
        success: true,
        message: 'Document type created successfully',
        data: documentType,
      });
    }
  );

  /**
   * GET /api/admin/document-types
   * Get all document types
   */
  getAllDocumentTypes = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const documentTypes = await adminService.getAllDocumentTypes();

      res.status(200).json({
        success: true,
        count: documentTypes.length,
        data: {
          documentTypes,
        },
      });
    }
  );

  /**
   * GET /api/admin/customers
   * Fetch all registered customers
   */
  getAllCustomers = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const customers = await adminService.getAllCustomers();

      res.status(200).json({
        success: true,
        count: customers.length,
        data: {
          customers,
        },
      });
    }
  );

  /**
   * GET /api/admin/customers/:id
   * Get customer by ID
   */
  getCustomerById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const customer = await adminService.getCustomerById(req.params.id);

      res.status(200).json({
        success: true,
        data: customer,
      });
    }
  );

  /**
   * GET /api/admin/partners
   * Fetch all registered partners
   */
  getAllPartners = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const partners = await adminService.getAllPartners();

      res.status(200).json({
        success: true,
        count: partners.length,
        data: {
          partners,
        },
      });
    }
  );

  /**
   * GET /api/admin/partners/:id
   * Get partner by ID
   */
  getPartnerById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const partner = await adminService.getPartnerById(req.params.id);

      res.status(200).json({
        success: true,
        data: partner,
      });
    }
  );

  /**
   * GET /api/admin/documents
   * Fetch all customer documents with populated references
   */
  getAllDocuments = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const filters: any = {};

      // Optional query parameters
      if (req.query.customerId) {
        filters.customerId = req.query.customerId as string;
      }
      if (req.query.documentType) {
        filters.documentType = req.query.documentType as string;
      }
      if (req.query.isVerified !== undefined) {
        filters.isVerified = req.query.isVerified === 'true';
      }

      const documents = await adminService.getAllDocuments(filters);

      res.status(200).json({
        success: true,
        count: documents.length,
        data: {
          documents,
        },
      });
    }
  );

  /**
   * GET /api/admin/documents/:id
   * Get document by ID
   */
  getDocumentById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const document = await adminService.getDocumentById(req.params.id);

      res.status(200).json({
        success: true,
        data: document,
      });
    }
  );

  /**
   * GET /api/admin/documents/unverified
   * Get all unverified documents
   */
  getUnverifiedDocuments = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const documents = await adminService.getAllDocuments({ isVerified: false });

      res.status(200).json({
        success: true,
        count: documents.length,
        data: {
          documents,
        },
      });
    }
  );

  /**
   * PUT /api/admin/documents/:id/verify
   * Verify a customer document
   */
  verifyDocument = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const documentId = req.params.id;
      // In a real implementation, this would come from authenticated admin session
      const adminId = req.body.adminId || req.headers['x-admin-id'];

      if (!adminId) {
        res.status(400).json({
          success: false,
          message: 'Admin ID is required (provide adminId in body or x-admin-id header)',
        });
        return;
      }

      const document = await adminService.verifyDocument(documentId, adminId as string);

      res.status(200).json({
        success: true,
        message: 'Document verified successfully',
        data: document,
      });
    }
  );

  /**
   * GET /api/admin/dashboard/stats
   * Get dashboard statistics
   */
  getDashboardStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await adminService.getDashboardStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    }
  );
}

export const adminController = new AdminController();
