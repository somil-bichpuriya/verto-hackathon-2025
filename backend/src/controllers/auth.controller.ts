import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Customer } from '../models/Customer.model';
import { Partner } from '../models/Partner.model';
import { VertoAdmin } from '../models/VertoAdmin.model';
import { generateToken } from '../utils/jwt.util';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/AppError';

export class AuthController {
  /**
   * POST /api/v1/auth/customer/login
   * Customer login
   */
  loginCustomer = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Find customer with password field included
      const customer = await Customer.findOne({ email }).select('+passwordHash');
      
      if (!customer) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, customer.passwordHash);
      
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate JWT token
      const token = generateToken({
        id: customer._id.toString(),
        type: 'customer',
        email: customer.email,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: customer._id,
            companyName: customer.companyName,
            email: customer.email,
            type: 'customer',
          },
        },
      });
    }
  );

  /**
   * POST /api/v1/auth/partner/login
   * Partner login
   */
  loginPartner = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Find partner with password field included
      const partner = await Partner.findOne({ email }).select('+passwordHash');
      
      if (!partner) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Check if partner is active
      if (!partner.isActive) {
        throw new UnauthorizedError('Partner account is inactive');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, partner.passwordHash);
      
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate JWT token
      const token = generateToken({
        id: partner._id.toString(),
        type: 'partner',
        email: partner.email,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: partner._id,
            companyName: partner.companyName,
            email: partner.email,
            apiKey: partner.apiKey,
            type: 'partner',
          },
        },
      });
    }
  );

  /**
   * POST /api/v1/auth/admin/login
   * Verto Admin login
   */
  loginAdmin = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new ValidationError('Username and password are required');
      }

      // Find admin with password field included
      const admin = await VertoAdmin.findOne({ username }).select('+passwordHash');
      
      if (!admin) {
        throw new UnauthorizedError('Invalid username or password');
      }

      // Check if admin is active
      if (!admin.isActive) {
        throw new UnauthorizedError('Admin account is inactive');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
      
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid username or password');
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Generate JWT token
      const token = generateToken({
        id: admin._id.toString(),
        type: 'admin',
        username: admin.username,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: admin._id,
            username: admin.username,
            role: admin.role,
            type: 'admin',
          },
        },
      });
    }
  );

  /**
   * GET /api/v1/auth/me
   * Get current user info
   */
  getCurrentUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const jwtUser = req.jwtUser;

      if (!jwtUser) {
        throw new UnauthorizedError('Not authenticated');
      }

      let user;

      switch (jwtUser.type) {
        case 'customer':
          user = await Customer.findById(jwtUser.id);
          if (!user) throw new NotFoundError('Customer not found');
          break;
        case 'partner':
          user = await Partner.findById(jwtUser.id);
          if (!user) throw new NotFoundError('Partner not found');
          break;
        case 'admin':
          user = await VertoAdmin.findById(jwtUser.id);
          if (!user) throw new NotFoundError('Admin not found');
          break;
        default:
          throw new UnauthorizedError('Invalid user type');
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            ...(jwtUser.type === 'admin' 
              ? { username: (user as any).username, role: (user as any).role }
              : { companyName: (user as any).companyName, email: (user as any).email }
            ),
            type: jwtUser.type,
          },
        },
      });
    }
  );

  /**
   * POST /api/v1/auth/logout
   * Logout (client-side token removal, but endpoint for consistency)
   */
  logout = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    }
  );
}

export const authController = new AuthController();
