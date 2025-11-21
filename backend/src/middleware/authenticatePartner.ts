import { Request, Response, NextFunction } from 'express';
import { partnerService } from '../services/partner.service';
import { AuthenticatedPartner } from './partnerAuth';
import { logger } from './logger';

// Extend Express Request type to include partner
declare global {
  namespace Express {
    interface Request {
      partner?: AuthenticatedPartner;
    }
  }
}

/**
 * Middleware to authenticate partner using API key and secret
 * Expects x-api-key and x-api-secret headers
 */
export const authenticatePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract API credentials from headers
    const apiKey = req.headers['x-api-key'] as string;
    const apiSecret = req.headers['x-api-secret'] as string;

    // Check if credentials are provided
    if (!apiKey || !apiSecret) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide x-api-key and x-api-secret headers.',
      });
      return;
    }

    // Authenticate partner
    const partner = await partnerService.authenticatePartner(apiKey, apiSecret);

    if (!partner || !partner.id) {
      logger.warn('Failed partner authentication attempt', {
        apiKey: apiKey.substring(0, 10) + '...',
        ip: req.ip,
        url: req.originalUrl,
      });

      res.status(401).json({
        success: false,
        message: 'Invalid API credentials or partner account is inactive.',
      });
      return;
    }

    // Attach partner to request object
    req.partner = partner as AuthenticatedPartner;

    logger.info('Partner authenticated successfully', {
      partnerId: partner._id,
      companyName: partner.companyName,
      url: req.originalUrl,
    });

    next();
  } catch (error) {
    logger.error('Error in partner authentication middleware', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({
      success: false,
      message: 'An error occurred during authentication.',
    });
  }
};

/**
 * Optional middleware to check if partner has access to specific document types
 */
export const requireDocumentTypes = (requiredTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.partner) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const partnerTypes = req.partner.documentTypesConfig || [];
    const hasAccess = requiredTypes.every(type => partnerTypes.includes(type));

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Your account does not have permission to access these document types.',
        requiredTypes,
        yourTypes: partnerTypes,
      });
      return;
    }

    next();
  };
};
