export interface User {
  id: string;
  email: string;
  fullName: string;
  company: string;
  role: 'admin' | 'reviewer' | 'operator';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  country: string;
  status: 'approved' | 'pending' | 'rejected';
  documents: number;
  joinedDate: string;
  lastActivity: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  country: string;
  requestsCount: number;
  status: 'active' | 'pending' | 'inactive';
  joinedDate: string;
  lastRequest: string;
}

export interface Document {
  id: string;
  clientId: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  status: 'approved' | 'pending' | 'rejected';
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
  previewUrl?: string;
}

export interface Activity {
  id: string;
  clientId: string;
  client: string;
  action: string;
  time: string;
  status: 'approved' | 'pending' | 'rejected';
  country: string;
}

export interface Stats {
  totalClients: number;
  pendingReviews: number;
  approved: number;
  activePartners: number;
}
