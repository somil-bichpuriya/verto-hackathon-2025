import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customer.service';
import { getCustomerDocuments } from '../services/document.service';
import { asyncHandler } from '../middleware/errorHandler';

export class CustomerController {
  /**
   * POST /api/register/customer
   * Register a new customer
   */
  registerCustomer = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { companyName, email, address } = req.body;

      const customer = await customerService.registerCustomer({
        companyName,
        email,
        address,
      });

      res.status(201).json({
        success: true,
        message: 'Customer registered successfully',
        data: {
          customer: {
            id: customer._id.toString(),
            _id: customer._id,
            companyName: customer.companyName,
            email: customer.email,
            address: customer.address,
            createdAt: customer.createdAt,
          },
        },
      });
    }
  );

  /**
   * GET /api/customers/:id
   * Get customer by ID
   */
  getCustomerById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const customer = await customerService.getCustomerById(req.params.id);

      if (!customer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    }
  );

  /**
   * GET /api/customers/me/documents
   * Get authenticated customer's documents
   */
  getMyDocuments = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // req.jwtUser is set by JWT auth middleware
      if (!req.jwtUser || req.jwtUser.type !== 'customer') {
        res.status(403).json({
          success: false,
          message: 'Customer authentication required',
        });
        return;
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
    }
  );
}

export const customerController = new CustomerController();
