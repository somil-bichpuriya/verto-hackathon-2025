import { v4 as uuidv4 } from 'uuid';
import ConsentRequest from '../models/ConsentRequest.model';
import { Customer } from '../models/Customer.model';
import { Partner } from '../models/Partner.model';
import { AppError } from '../utils/AppError';

const CONSENT_EXPIRY_HOURS = 24;

export const generateConsentRequest = async (
  partnerId: string,
  customerEmail: string
) => {
  // Find customer
  const customer = await Customer.findOne({ email: customerEmail });
  if (!customer) {
    throw new AppError(`Customer with email '${customerEmail}' not found`, 404);
  }

  // Find partner to get document types config
  const partner = await Partner.findById(partnerId);
  if (!partner || partner.documentTypesConfig.length === 0) {
    throw new AppError('Partner has no document types configured', 400);
  }

  // Check for existing active consent request
  const existingRequest = await ConsentRequest.findOne({
    partner: partnerId,
    customer: customer._id,
    isGranted: false,
    expiresAt: { $gt: new Date() },
  });

  if (existingRequest) {
    return {
      consentToken: existingRequest.consentToken,
      expiresAt: existingRequest.expiresAt,
    };
  }

  // Generate unique token
  const consentToken = uuidv4();
  
  // Set expiration
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + CONSENT_EXPIRY_HOURS);

  // Create consent request
  const consentRequest = await ConsentRequest.create({
    consentToken,
    partner: partnerId,
    customer: customer._id,
    documentTypesRequested: partner.documentTypesConfig,
    expiresAt,
  });

  return {
    consentToken: consentRequest.consentToken,
    expiresAt: consentRequest.expiresAt,
  };
};

export const getConsentDetails = async (token: string) => {
  const consentRequest = await ConsentRequest.findOne({ consentToken: token })
    .populate('partner', 'companyName documentTypesConfig')
    .populate('customer', 'companyName email');

  if (!consentRequest) {
    throw new AppError('Invalid consent token', 404);
  }

  if (consentRequest.isExpired()) {
    throw new AppError('Consent token has expired', 410);
  }

  if (consentRequest.isGranted) {
    throw new AppError('Consent has already been granted', 400);
  }

  return {
    partnerName: (consentRequest.partner as any).companyName,
    customerName: (consentRequest.customer as any).companyName,
    customerEmail: (consentRequest.customer as any).email,
    documentTypesNeeded: consentRequest.documentTypesRequested,
    expiresAt: consentRequest.expiresAt,
  };
};

export const grantConsent = async (token: string) => {
  const consentRequest = await ConsentRequest.findOne({ consentToken: token });

  if (!consentRequest) {
    throw new AppError('Invalid consent token', 404);
  }

  if (consentRequest.isExpired()) {
    throw new AppError('Consent token has expired', 410);
  }

  if (consentRequest.isGranted) {
    throw new AppError('Consent has already been granted', 400);
  }

  // Grant consent
  consentRequest.isGranted = true;
  consentRequest.grantedAt = new Date();
  await consentRequest.save();

  return await consentRequest.populate(['partner', 'customer']);
};

export const verifyConsent = async (partnerId: string, customerEmail: string) => {
  // Find customer
  const customer = await Customer.findOne({ email: customerEmail });
  if (!customer) {
    throw new AppError(`Customer with email '${customerEmail}' not found`, 404);
  }

  // Find active consent
  const consentRequest = await ConsentRequest.findOne({
    partner: partnerId,
    customer: customer._id,
    isGranted: true,
  });

  if (!consentRequest) {
    throw new AppError(
      'No consent granted. Customer must grant access before documents can be retrieved.',
      403
    );
  }

  if (consentRequest.isExpired()) {
    throw new AppError(
      'Consent has expired. Please request new consent from the customer.',
      403
    );
  }

  return {
    customerId: customer._id.toString(),
    allowedDocumentTypes: consentRequest.documentTypesRequested,
  };
};
