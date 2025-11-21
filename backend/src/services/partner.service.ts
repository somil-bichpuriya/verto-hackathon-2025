import { Partner, IPartner } from '../models/Partner.model';
import { ValidationError, NotFoundError } from '../utils/AppError';
import crypto from 'crypto';

export class PartnerService {
  /**
   * Register a new partner with auto-generated API keys
   */
  async registerPartner(data: {
    companyName: string;
    email: string;
    documentTypesConfig: string[];
  }): Promise<{ partner: IPartner; apiKey: string; apiSecret: string }> {
    // Check if partner already exists by email
    const existingPartnerByEmail = await Partner.findOne({ email: data.email });
    if (existingPartnerByEmail) {
      throw new ValidationError('A partner with this email already exists');
    }

    // Check if partner already exists by company name
    const existingPartnerByName = await Partner.findOne({ companyName: data.companyName });
    if (existingPartnerByName) {
      throw new ValidationError('A partner with this company name already exists');
    }

    // Create new partner (apiKey and apiSecret are auto-generated in pre-save hook)
    const partner = await Partner.create(data);

    // Fetch the partner with apiSecret included for the response
    const partnerWithSecret = await Partner.findById(partner._id).select('+apiSecret');
    if (!partnerWithSecret) {
      throw new Error('Failed to retrieve partner after creation');
    }

    // Return partner data along with credentials (only time secret is returned)
    return {
      partner: partner,
      apiKey: partnerWithSecret.apiKey,
      apiSecret: partnerWithSecret.apiSecret,
    };
  }

  /**
   * Authenticate partner by API key and secret
   */
  async authenticatePartner(apiKey: string, apiSecret: string): Promise<IPartner | null> {
    // Find partner by API key and include apiSecret for comparison
    const partner = await Partner.findOne({ apiKey, isActive: true }).select('+apiSecret');
    
    if (!partner) {
      return null;
    }

    // Compare the provided secret with the stored secret
    // Using timing-safe comparison to prevent timing attacks
    const providedSecretBuffer = Buffer.from(apiSecret);
    const storedSecretBuffer = Buffer.from(partner.apiSecret);

    if (providedSecretBuffer.length !== storedSecretBuffer.length) {
      return null;
    }

    const isValidSecret = crypto.timingSafeEqual(providedSecretBuffer, storedSecretBuffer);
    
    if (!isValidSecret) {
      return null;
    }

    // Remove apiSecret from returned object for security
    const partnerObj: any = partner.toObject();
    delete partnerObj.apiSecret;

    return partnerObj as IPartner;
  }

  /**
   * Get partner by ID
   */
  async getPartnerById(id: string): Promise<IPartner | null> {
    return await Partner.findById(id).select('-apiSecret');
  }

  /**
   * Get partner by email
   */
  async getPartnerByEmail(email: string): Promise<IPartner | null> {
    return await Partner.findOne({ email }).select('-apiSecret');
  }

  /**
   * Update partner's document types configuration
   */
  async updateDocumentTypesConfig(
    partnerId: string,
    documentTypesConfig: string[]
  ): Promise<IPartner> {
    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      { documentTypesConfig },
      { new: true, runValidators: true }
    ).select('-apiSecret');

    if (!partner) {
      throw new NotFoundError('Partner not found');
    }

    return partner;
  }

  /**
   * Deactivate a partner
   */
  async deactivatePartner(partnerId: string): Promise<IPartner> {
    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      { isActive: false },
      { new: true }
    ).select('-apiSecret');

    if (!partner) {
      throw new NotFoundError('Partner not found');
    }

    return partner;
  }
}

export const partnerService = new PartnerService();
