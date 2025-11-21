import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.util';
import { logger } from './logger';

// Extend Express Request type to include JWT user
declare global {
  namespace Express {
    interface Request {
      jwtUser?: JwtPayload;
    }
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login to access this resource.',
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user info to request
    req.jwtUser = decoded;
    
    return next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.jwtUser || req.jwtUser.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  return next();
};

/**
 * Middleware to check if user is partner
 */
export const requirePartner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.jwtUser || req.jwtUser.type !== 'partner') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Partner privileges required.',
    });
  }
  return next();
};

/**
 * Middleware to check if user is customer
 */
export const requireCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.jwtUser || req.jwtUser.type !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customer privileges required.',
    });
  }
  return next();
};
