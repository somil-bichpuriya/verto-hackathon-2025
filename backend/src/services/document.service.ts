import { CustomerDocument } from '../models/CustomerDocument.model';
import { DocumentType } from '../models/DocumentType.model';
import { AppError } from '../utils/AppError';

export const uploadCustomerDocument = async (
  customerId: string,
  documentTypeId: string,
  s3Link: string
) => {
  // Verify document type exists by ID
  const documentType = await DocumentType.findById(documentTypeId);
  if (!documentType) {
    throw new AppError(`Document type not found`, 404);
  }

  // Check if document already exists for this customer and type
  const existingDoc = await CustomerDocument.findOne({
    customer: customerId,
    documentType: documentType._id,
  });

  if (existingDoc) {
    throw new AppError(
      `Document of type '${documentType.name}' already exists for this customer`,
      409
    );
  }

  // Create new document
  const document = await CustomerDocument.create({
    customer: customerId,
    documentType: documentType._id,
    s3Link,
    isVerified: false,
  });

  return await document.populate(['customer', 'documentType']);
};

export const getCustomerDocuments = async (customerId: string) => {
  return await CustomerDocument.find({ customer: customerId })
    .populate('documentType')
    .populate('verifiedBy', 'username')
    .sort({ createdAt: -1 });
};
