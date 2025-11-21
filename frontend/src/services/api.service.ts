import { api } from '../config/api';
import type { Customer, Partner, DocumentType, PartnerCredentials, ApiResponse } from '../types';

export const customerService = {
  register: async (data: Omit<Customer, 'id' | 'createdAt'>) => {
    const response = await api.post<ApiResponse<{ customer: Customer }>>('/register/customer', data);
    return response.data;
  },
  
  getMyDocuments: async () => {
    const response = await api.get<ApiResponse<{ documents: any[] }>>('/customers/me/documents');
    return response.data;
  },
};

export const partnerService = {
  register: async (data: Omit<Partner, 'id' | 'isActive' | 'createdAt'>) => {
    const response = await api.post<ApiResponse<{ partner: Partner; credentials: PartnerCredentials }>>(
      '/register/partner',
      data
    );
    return response.data;
  },
  
  getMyDocumentTypes: async () => {
    const response = await api.get<ApiResponse<{ documentTypesConfig: string[] }>>('/partners/me/document-types');
    return response.data;
  },
  
  updateMyDocumentTypes: async (documentTypesConfig: string[]) => {
    const response = await api.put<ApiResponse<{ documentTypesConfig: string[] }>>(
      '/partners/me/document-types',
      { documentTypesConfig }
    );
    return response.data;
  },
};

export const adminService = {
  getDocumentTypes: async () => {
    const response = await api.get<ApiResponse<{ documentTypes: DocumentType[] }>>('/admin/document-types');
    return response.data;
  },
  
  createDocumentType: async (data: { name: string; description: string; requiredFor?: string[] }) => {
    const response = await api.post<ApiResponse<{ documentType: DocumentType }>>('/admin/document-types', data);
    return response.data;
  },
  
  getAllCustomers: async () => {
    const response = await api.get<ApiResponse<{ customers: Customer[] }>>('/admin/customers');
    return response.data;
  },
  
  getAllPartners: async () => {
    const response = await api.get<ApiResponse<{ partners: Partner[] }>>('/admin/partners');
    return response.data;
  },
  
  getUnverifiedDocuments: async () => {
    const response = await api.get<ApiResponse<{ documents: any[] }>>('/admin/documents/unverified');
    return response.data;
  },
  
  verifyDocument: async (documentId: string, adminId: string) => {
    const response = await api.put(`/admin/documents/${documentId}/verify`, { adminId });
    return response.data;
  },
};

export const uploadService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<{
      filename: string;
      originalName: string;
      mimetype: string;
      size: number;
      url: string;
    }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  uploadMultipleFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post<ApiResponse<{
      files: Array<{
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        url: string;
      }>;
    }>>('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

