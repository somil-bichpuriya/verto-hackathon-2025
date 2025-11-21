import { Request, Response, NextFunction } from 'express';
import { partnerService } from '../services/partner.service';
import { asyncHandler } from '../middleware/errorHandler';

export class PartnerController {
  /**
   * POST /api/register/partner
   * Register a new partner and generate API credentials
   */
  registerPartner = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { companyName, email, documentTypesConfig } = req.body;

      const result = await partnerService.registerPartner({
        companyName,
        email,
        documentTypesConfig: documentTypesConfig || [],
      });

      res.status(201).json({
        success: true,
        message: 'Partner registered successfully',
        data: {
          partner: {
            id: result.partner._id.toString(),
            _id: result.partner._id,
            companyName: result.partner.companyName,
            email: result.partner.email,
            documentTypesConfig: result.partner.documentTypesConfig,
            isActive: result.partner.isActive,
            createdAt: result.partner.createdAt,
          },
          credentials: {
            apiKey: result.apiKey,
            apiSecret: result.apiSecret,
          },
        },
        warning: 'IMPORTANT: Store these credentials securely. The API secret will not be shown again.',
      });
    }
  );

  /**
   * GET /api/partners/:id
   * Get partner by ID
   */
  getPartnerById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const partner = await partnerService.getPartnerById(req.params.id);

      if (!partner) {
        res.status(404).json({
          success: false,
          message: 'Partner not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: partner,
      });
    }
  );

  /**
   * PUT /api/partners/:id/document-types
   * Update partner's document types configuration
   */
  updateDocumentTypes = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { documentTypesConfig } = req.body;

      const partner = await partnerService.updateDocumentTypesConfig(
        req.params.id,
        documentTypesConfig
      );

      res.status(200).json({
        success: true,
        message: 'Document types configuration updated successfully',
        data: partner,
      });
    }
  );

  /**
   * GET /api/partners/me/document-types
   * Get authenticated partner's document types configuration
   */
  getMyDocumentTypes = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // req.jwtUser is set by JWT auth middleware
      if (!req.jwtUser || req.jwtUser.type !== 'partner') {
        res.status(403).json({
          success: false,
          message: 'Partner authentication required',
        });
        return;
      }

      const partner = await partnerService.getPartnerById(req.jwtUser.id);

      if (!partner) {
        res.status(404).json({
          success: false,
          message: 'Partner not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          documentTypesConfig: partner.documentTypesConfig || [],
        },
      });
    }
  );

  /**
   * PUT /api/partners/me/document-types
   * Update authenticated partner's document types configuration
   */
  updateMyDocumentTypes = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // req.jwtUser is set by JWT auth middleware
      if (!req.jwtUser || req.jwtUser.type !== 'partner') {
        res.status(403).json({
          success: false,
          message: 'Partner authentication required',
        });
        return;
      }

      const { documentTypesConfig } = req.body;

      const partner = await partnerService.updateDocumentTypesConfig(
        req.jwtUser.id,
        documentTypesConfig
      );

      res.status(200).json({
        success: true,
        message: 'Document types configuration updated successfully',
        data: {
          documentTypesConfig: partner.documentTypesConfig,
        },
      });
    }
  );
}

export const partnerController = new PartnerController();
