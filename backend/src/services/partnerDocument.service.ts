import { CustomerDocument } from '../models/CustomerDocument.model';
import { verifyConsent } from './consent.service';

export const getCustomerDocumentsByPartner = async (
  partnerId: string,
  customerEmail: string,
  partnerDocumentTypes: string[]
) => {
  // Verify consent first
  const consent = await verifyConsent(partnerId, customerEmail);

  // Get all documents for the customer
  const allDocuments = await CustomerDocument.find({
    customer: consent.customerId,
  }).populate('documentType', 'name');

  // Filter documents to only include types the partner is allowed to see
  const allowedDocuments = allDocuments.filter((doc) => {
    const docTypeName = (doc.documentType as any).name;
    return (
      consent.allowedDocumentTypes.includes(docTypeName) &&
      partnerDocumentTypes.includes(docTypeName)
    );
  });

  return allowedDocuments.map((doc) => ({
    documentType: (doc.documentType as any).name,
    s3Link: doc.s3Link,
    isVerified: doc.isVerified,
    uploadedAt: doc.createdAt,
  }));
};
