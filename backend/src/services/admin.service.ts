import { DocumentType, IDocumentType } from '../models/DocumentType.model';
import { Customer, ICustomer } from '../models/Customer.model';
import { Partner, IPartner } from '../models/Partner.model';
import { CustomerDocument, ICustomerDocument } from '../models/CustomerDocument.model';
import { VertoAdmin } from '../models/VertoAdmin.model';
import { NotFoundError, ValidationError } from '../utils/AppError';
import mongoose from 'mongoose';

export class AdminService {
  /**
   * Create a new document type
   */
  async createDocumentType(data: Partial<IDocumentType>): Promise<IDocumentType> {
    // Check if document type already exists
    const existing = await DocumentType.findOne({ name: data.name });
    if (existing) {
      throw new ValidationError(`Document type "${data.name}" already exists`);
    }

    const documentType = await DocumentType.create(data);
    return documentType;
  }

  /**
   * Get all document types
   */
  async getAllDocumentTypes(): Promise<IDocumentType[]> {
    return await DocumentType.find().sort({ name: 1 });
  }

  /**
   * Get all customers
   */
  async getAllCustomers(): Promise<ICustomer[]> {
    return await Customer.find().sort({ createdAt: -1 });
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<ICustomer> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid customer ID');
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    return customer;
  }

  /**
   * Get all partners
   */
  async getAllPartners(): Promise<IPartner[]> {
    // Don't include apiSecret in the response
    return await Partner.find().select('-apiSecret').sort({ createdAt: -1 });
  }

  /**
   * Get partner by ID
   */
  async getPartnerById(id: string): Promise<IPartner> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid partner ID');
    }

    const partner = await Partner.findById(id).select('-apiSecret');
    if (!partner) {
      throw new NotFoundError('Partner not found');
    }

    return partner;
  }

  /**
   * Get all customer documents with populated references
   */
  async getAllDocuments(filters?: {
    customerId?: string;
    documentType?: string;
    isVerified?: boolean;
  }): Promise<ICustomerDocument[]> {
    const query: any = {};

    if (filters?.customerId) {
      if (!mongoose.Types.ObjectId.isValid(filters.customerId)) {
        throw new ValidationError('Invalid customer ID');
      }
      query.customer = filters.customerId;
    }

    if (filters?.documentType) {
      query.documentType = filters.documentType;
    }

    if (filters?.isVerified !== undefined) {
      query.isVerified = filters.isVerified;
    }

    return await CustomerDocument.find(query)
      .populate('customer', 'companyName email')
      .populate('documentType', 'name description')
      .populate('verifiedBy', 'username role')
      .sort({ uploadedAt: -1 });
  }

  /**
   * Get document by ID
   */
  async getDocumentById(id: string): Promise<ICustomerDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid document ID');
    }

    const document = await CustomerDocument.findById(id)
      .populate('customer', 'companyName email address')
      .populate('documentType', 'name description')
      .populate('verifiedBy', 'username role');

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    return document;
  }

  /**
   * Verify a customer document
   */
  async verifyDocument(
    documentId: string,
    adminId: string
  ): Promise<ICustomerDocument> {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new ValidationError('Invalid document ID');
    }

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      throw new ValidationError('Invalid admin ID');
    }

    // Verify admin exists and has permission
    const admin = await VertoAdmin.findById(adminId);
    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    // Check if admin has permission to verify documents based on role
    const canVerify = admin.role === 'admin' || admin.role === 'super_admin';
    if (!canVerify) {
      throw new ValidationError('Admin does not have permission to verify documents');
    }

    // Find and update document
    const document = await CustomerDocument.findById(documentId);
    if (!document) {
      throw new NotFoundError('Document not found');
    }

    if (document.isVerified) {
      throw new ValidationError('Document is already verified');
    }

    document.isVerified = true;
    document.verifiedBy = new mongoose.Types.ObjectId(adminId);
    document.verifiedAt = new Date();

    await document.save();

    // Return populated document
    return await CustomerDocument.findById(documentId)
      .populate('customer', 'companyName email')
      .populate('verifiedBy', 'username role')
      .populate('documentType', 'name description') as ICustomerDocument;
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [
      totalCustomers,
      totalPartners,
      totalDocuments,
      verifiedDocuments,
      pendingDocuments,
      totalDocumentTypes,
    ] = await Promise.all([
      Customer.countDocuments(),
      Partner.countDocuments({ isActive: true }),
      CustomerDocument.countDocuments(),
      CustomerDocument.countDocuments({ isVerified: true }),
      CustomerDocument.countDocuments({ isVerified: false }),
      DocumentType.countDocuments(),
    ]);

    return {
      totalCustomers,
      totalPartners,
      totalDocuments,
      verifiedDocuments,
      pendingDocuments,
      totalDocumentTypes,
      verificationRate:
        totalDocuments > 0
          ? ((verifiedDocuments / totalDocuments) * 100).toFixed(2) + '%'
          : '0%',
    };
  }
}

export const adminService = new AdminService();
