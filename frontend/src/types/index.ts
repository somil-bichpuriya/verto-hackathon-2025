export interface Customer {
  id: string;
  _id?: string;
  companyName: string;
  email: string;
  address: string;
  createdAt?: string;
}

export interface Partner {
  id: string;
  _id?: string;
  companyName: string;
  email: string;
  documentTypesConfig: string[];
  isActive: boolean;
  createdAt?: string;
}

export interface DocumentType {
  _id: string;
  name: string;
  description: string;
  requiredFor?: string[];
  createdAt?: string;
}

export interface CustomerDocument {
  id: string;
  documentType: string;
  s3Link: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  uploadedAt: string;
}

export interface PartnerCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
