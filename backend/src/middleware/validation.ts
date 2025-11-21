import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/AppError';

/**
 * Validation middleware for document type creation
 */
export const validateDocumentType = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { name, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new ValidationError('Valid name is required (minimum 2 characters)'));
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return next(new ValidationError('Valid description is required (minimum 10 characters)'));
  }

  if (req.body.requiredFor && !Array.isArray(req.body.requiredFor)) {
    return next(new ValidationError('requiredFor must be an array'));
  }

  next();
};

/**
 * Validation middleware for customer creation
 */
export const validateCustomer = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { companyName, email, address } = req.body;

  if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
    return next(new ValidationError('Valid company name is required'));
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return next(new ValidationError('Valid email is required'));
  }

  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return next(new ValidationError('Valid address is required'));
  }

  next();
};

/**
 * Validation middleware for partner creation
 */
export const validatePartner = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { companyName, email, documentTypesConfig } = req.body;

  if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
    return next(new ValidationError('Valid company name is required'));
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return next(new ValidationError('Valid email is required'));
  }

  if (documentTypesConfig && !Array.isArray(documentTypesConfig)) {
    return next(new ValidationError('documentTypesConfig must be an array'));
  }

  next();
};

/**
 * Validation middleware for document upload
 */
export const validateDocument = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { customer, documentType, s3Link } = req.body;

  if (!customer || typeof customer !== 'string') {
    return next(new ValidationError('Valid customer ID is required'));
  }

  if (!documentType || typeof documentType !== 'string') {
    return next(new ValidationError('Valid document type is required'));
  }

  if (!s3Link || typeof s3Link !== 'string') {
    return next(new ValidationError('Valid S3 link is required'));
  }

  next();
};

/**
 * Validation middleware for MongoDB ObjectId
 */
export const validateObjectId = (paramName: string = 'id') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!id || !objectIdRegex.test(id)) {
      return next(new ValidationError(`Invalid ${paramName} format`));
    }

    next();
  };
};
