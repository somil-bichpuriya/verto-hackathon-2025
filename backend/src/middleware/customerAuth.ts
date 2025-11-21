import { Request, Response, NextFunction } from 'express';
import { Customer } from '../models/Customer.model';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';

export const authenticateCustomer = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const customerEmail = req.headers['x-customer-email'] as string;

    if (!customerEmail) {
      throw new AppError('Customer email is required in x-customer-email header', 401);
    }

    const customer = await Customer.findOne({ email: customerEmail });

    if (!customer) {
      throw new AppError('Invalid customer credentials', 401);
    }

    req.customer = {
      id: customer._id.toString(),
      companyName: customer.companyName,
      email: customer.email,
      address: customer.address,
    };

    next();
  }
);
