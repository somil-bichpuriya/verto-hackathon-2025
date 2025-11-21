import { IUser } from '../models/User.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      partner?: {
        id: string;
        companyName: string;
        email: string;
        documentTypesConfig: string[];
        isActive: boolean;
      };
      customer?: {
        id: string;
        companyName: string;
        email: string;
        address: string;
      };
    }
  }
}

export {};
