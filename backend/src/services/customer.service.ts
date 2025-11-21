import { Customer, ICustomer } from '../models/Customer.model';
import { ValidationError } from '../utils/AppError';

export class CustomerService {
  /**
   * Register a new customer
   */
  async registerCustomer(data: {
    companyName: string;
    email: string;
    address: string;
  }): Promise<ICustomer> {
    // Check if customer already exists by email
    const existingCustomerByEmail = await Customer.findOne({ email: data.email });
    if (existingCustomerByEmail) {
      throw new ValidationError('A customer with this email already exists');
    }

    // Check if customer already exists by company name
    const existingCustomerByName = await Customer.findOne({ companyName: data.companyName });
    if (existingCustomerByName) {
      throw new ValidationError('A customer with this company name already exists');
    }

    // Create new customer
    const customer = await Customer.create(data);
    return customer;
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<ICustomer | null> {
    return await Customer.findById(id);
  }

  /**
   * Get customer by email
   */
  async getCustomerByEmail(email: string): Promise<ICustomer | null> {
    return await Customer.findOne({ email });
  }
}

export const customerService = new CustomerService();
