import { Router } from 'express';
import { authenticatePartner } from '../middleware/partnerAuth';
import { Request, Response } from 'express';
import { getCustomerDocumentsByPartner } from '../services/partnerDocument.service';
import { AppError } from '../utils/AppError';

const router = Router();

/**
 * Protected route example - requires partner authentication
 * GET /api/v1/partner/me
 */
router.get('/me', authenticatePartner, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Partner authenticated successfully',
    data: {
      partner: {
        id: req.partner?.id,
        companyName: req.partner?.companyName,
        email: req.partner?.email,
        documentTypesConfig: req.partner?.documentTypesConfig,
        isActive: req.partner?.isActive,
      },
    },
  });
});

/**
 * Get customer documents with consent verification
 * GET /api/v1/partner/documents/:customerEmail
 */
router.get(
  '/documents/:customerEmail',
  authenticatePartner,
  async (req: Request, res: Response, next) => {
    try {
      const { customerEmail } = req.params;

      if (!customerEmail) {
        throw new AppError('Customer email is required', 400);
      }

      if (!req.partner) {
        throw new AppError('Partner authentication required', 401);
      }

      const documents = await getCustomerDocumentsByPartner(
        req.partner.id,
        customerEmail,
        req.partner.documentTypesConfig
      );

      res.status(200).json({
        success: true,
        message: 'Documents retrieved successfully',
        data: {
          customerEmail,
          documents,
          documentCount: documents.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
