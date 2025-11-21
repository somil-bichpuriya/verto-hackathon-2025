import { Request, Response, NextFunction } from 'express';
import { Partner } from '../models/Partner.model';
import { UnauthorizedError } from '../utils/AppError';
import { logger } from './logger';

export interface AuthenticatedPartner {
  id: string;
  companyName: string;
  email: string;
  documentTypesConfig: string[];
  isActive: boolean;
}

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
 */
export const authenticatePartner = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract API credentials from headers
    const apiKey = req.headers['x-api-key'] as string;
    const apiSecret = req.headers['x-api-secret'] as string;

    // Check if credentials are provided
    if (!apiKey || !apiSecret) {
      throw new UnauthorizedError('API key and secret are required in headers (x-api-key, x-api-secret)');
    }

    // Find partner by API key and include the apiSecret field
    const partner = await Partner.findOne({ apiKey, isActive: true }).select('+apiSecret');

    // Validate partner exists
    if (!partner) {
      logger.warn('Failed authentication attempt with invalid API key', { apiKey });
      throw new UnauthorizedError('Invalid API credentials');
    }

    // Validate API secret
    if (partner.apiSecret !== apiSecret) {
      logger.warn('Failed authentication attempt with invalid API secret', { 
        partnerId: partner._id,
        companyName: partner.companyName 
      });
      throw new UnauthorizedError('Invalid API credentials');
    }

    // Attach partner to request object (exclude apiSecret from attached object)
    req.partner = {
      id: partner._id.toString(),
      companyName: partner.companyName,
      email: partner.email,
      documentTypesConfig: partner.documentTypesConfig,
      isActive: partner.isActive,
    };

    logger.info('Partner authenticated successfully', {
      partnerId: partner._id,
      companyName: partner.companyName,
    });

    next();
  } catch (error) {
    next(error);
  }
};
