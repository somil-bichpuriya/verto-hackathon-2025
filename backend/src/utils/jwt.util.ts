import jwt from 'jsonwebtoken';
import { logger } from '../middleware/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'verto-dev-secret-change-in-production';

export interface JwtPayload {
  id: string;
  type: 'customer' | 'partner' | 'admin';
  email?: string;
  username?: string;
}

/**
 * Generate JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  try {

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "24h"
    });
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    logger.error('Error decoding token:', error);
    return null;
  }
};
