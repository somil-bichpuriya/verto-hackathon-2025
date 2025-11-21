import { Request, Response, NextFunction } from 'express';
import {
  generateConsentRequest,
  getConsentDetails,
  grantConsent,
} from '../services/consent.service';
import { AppError } from '../utils/AppError';

// Create asyncHandler utility inline
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const generateConsent = asyncHandler(async (req: Request, res: Response) => {
  const { customerEmail } = req.body;

  if (!customerEmail) {
    throw new AppError('customerEmail is required', 400);
  }

  if (!req.partner) {
    throw new AppError('Partner authentication required', 401);
  }

  const result = await generateConsentRequest(req.partner.id, customerEmail);

  const consentLink = `${req.protocol}://${req.get('host')}/api/v1/customer/consent/${result.consentToken}`;

  res.status(201).json({
    success: true,
    message: 'Consent request generated successfully',
    data: {
      consentToken: result.consentToken,
      consentLink,
      expiresAt: result.expiresAt,
    },
  });
});

export const viewConsent = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    throw new AppError('Consent token is required', 400);
  }

  const consentDetails = await getConsentDetails(token);

  res.status(200).json({
    success: true,
    data: {
      consent: consentDetails,
    },
  });
});

export const grantConsentAction = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    throw new AppError('Consent token is required', 400);
  }

  const consentRequest = await grantConsent(token);

  res.status(200).json({
    success: true,
    message: 'Consent granted successfully',
    data: {
      consent: {
        partner: (consentRequest.partner as any).companyName,
        customer: (consentRequest.customer as any).companyName,
        documentTypesGranted: consentRequest.documentTypesRequested,
        grantedAt: consentRequest.grantedAt,
      },
    },
  });
});
