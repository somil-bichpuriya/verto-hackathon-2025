import { Request, Response, NextFunction } from 'express';
import { registrationService } from '../services/registration.service';
import { asyncHandler } from '../middleware/errorHandler';

export class RegistrationController {
  /**
   * POST /api/register/customer
   * Register a new customer
   */
  registerCustomer = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { companyName, email, address, password } = req.body;

      // Validate password
      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
      }

      const customer = await registrationService.registerCustomer({
        companyName,
        email,
        address,
        password,
      });

      res.status(201).json({
        success: true,
        message: 'Customer registered successfully. You can now log in with your credentials.',
        data: {
          customer: {
            id: customer._id,
            companyName: customer.companyName,
            email: customer.email,
            address: customer.address,
            createdAt: customer.createdAt,
          },
        },
      });
    }
  );

  /**
   * POST /api/register/partner
   * Register a new partner with API key generation
   */
  registerPartner = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { companyName, email, documentTypesConfig, password } = req.body;

      // Validate password
      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
      }

      const { partner, apiKey, apiSecret } = await registrationService.registerPartner({
        companyName,
        email,
        documentTypesConfig: documentTypesConfig || [],
        password,
      });

      res.status(201).json({
        success: true,
        message: 'Partner registered successfully. You can now log in with your credentials.',
        data: {
          partner: {
            id: partner._id,
            companyName: partner.companyName,
            email: partner.email,
            documentTypesConfig: partner.documentTypesConfig,
            createdAt: partner.createdAt,
          },
          credentials: {
            apiKey,
            apiSecret,
          },
        },
        warning: 'Please save your API credentials securely. The API secret will not be shown again.',
      });
    }
  );
}

export const registrationController = new RegistrationController();
