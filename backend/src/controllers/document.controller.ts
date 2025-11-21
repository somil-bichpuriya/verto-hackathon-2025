import { NextFunction, Request, Response } from 'express';
import { uploadCustomerDocument, getCustomerDocuments } from '../services/document.service';
import { AppError } from '../utils/AppError';

// Create asyncHandler utility inline
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const uploadDocument = asyncHandler(async (req: Request, res: Response) => {
  const { documentType, s3Link } = req.body;

  if (!documentType || !s3Link) {
    throw new AppError('documentType and s3Link are required', 400);
  }

  if (!req.jwtUser) {
    throw new AppError('Customer authentication required', 401);
  }

  const document = await uploadCustomerDocument(
    req.jwtUser.id,
    documentType,
    s3Link
  );

  // Handle populated documentType
  const docType = document.documentType as any;
  const documentTypeName = typeof docType === 'object' && docType !== null 
    ? docType.name || documentType 
    : documentType;

  res.status(201).json({
    success: true,
    message: 'Document uploaded successfully',
    data: {
      document: {
        id: document._id,
        documentType: documentTypeName,
        s3Link: document.s3Link,
        isVerified: document.isVerified,
        uploadedAt: document.createdAt,
      },
    },
  });
});

export const getMyDocuments = asyncHandler(async (req: Request, res: Response) => {
  if (!req.jwtUser) {
    throw new AppError('Customer authentication required', 401);
  }

  const documents = await getCustomerDocuments(req.jwtUser.id);

  res.status(200).json({
    success: true,
    data: {
      documents: documents.map((doc: any) => {
        const docType = doc.documentType;
        const documentTypeName = typeof docType === 'object' && docType !== null 
          ? docType.name 
          : docType;

        return {
          id: doc._id,
          documentType: documentTypeName || 'Unknown',
          s3Link: doc.s3Link,
          isVerified: doc.isVerified,
          verifiedBy: doc.verifiedBy ? (doc.verifiedBy as any).username : null,
          verifiedAt: doc.verifiedAt,
          uploadedAt: doc.createdAt,
        };
      }),
    },
  });
});
