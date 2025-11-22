import database from './database.json';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  company: string;
  role: string;
  registeredDate: string;
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
  expiryDate?: string;
  reviewNotes?: string;
  previewUrl?: string;
}

export interface Activity {
  id: number;
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
  rejected: number;
}

export interface VerificationTrend {
  month: string;
  verifications: number;
}

export interface DocumentStatusData {
  name: string;
  value: number;
  color: string;
}

// User Management
export const getAllUsers = (): User[] => {
  return database.users as User[];
};

export const getUserByEmail = (email: string): User | undefined => {
  return database.users.find(user => user.email.toLowerCase() === email.toLowerCase()) as User | undefined;
};

export const registerUser = (userData: Omit<User, 'id' | 'registeredDate'>): User => {
  const newUser: User = {
    ...userData,
    id: `USR-${String(database.users.length + 1).padStart(3, '0')}`,
    registeredDate: new Date().toISOString().split('T')[0]
  };
  
  // In a real app, this would save to a backend
  // For now, we'll just add it to memory (won't persist across refreshes)
  (database.users as any).push(newUser);
  
  // Save to localStorage for demo purposes
  localStorage.setItem('users', JSON.stringify(database.users));
  
  return newUser;
};

export const authenticateUser = (email: string, password: string): User | null => {
  // Check localStorage first
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    try {
      const users = JSON.parse(storedUsers) as User[];
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      if (user) return user;
    } catch (e) {
      console.error('Error parsing stored users:', e);
    }
  }
  
  // Fallback to database
  const user = database.users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  ) as User | undefined;
  
  return user || null;
};

// Authenticate admin using admins array
export const authenticateAdmin = (username: string, password: string): any | null => {
  const admin = database.admins.find(a => 
    a.username?.toLowerCase() === username.toLowerCase() && 
    a.password === password
  );
  return admin || null;
};

// Authenticate customer using customers array
export const authenticateCustomer = (email: string, password: string): any | null => {
  const customer = database.customers.find(c => 
    c.email.toLowerCase() === email.toLowerCase() && 
    c.password === password
  );
  return customer || null;
};

// Authenticate partner using partners array
export const authenticatePartner = (email: string, password: string): any | null => {
  const partner = database.partners.find(p => 
    p.email.toLowerCase() === email.toLowerCase() && 
    p.password === password
  );
  return partner || null;
};

// Initialize localStorage with database users if not already present
export const initializeUsers = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(database.users));
  }
};

// Initialize localStorage with database documents if not already present
export const initializeDocuments = () => {
  if (!localStorage.getItem('documents')) {
    localStorage.setItem('documents', JSON.stringify(database.documents));
  }
};

// Get all clients
export const getAllClients = (): Client[] => {
  return database.clients as Client[];
};

// Get client by ID
export const getClientById = (id: string): Client | undefined => {
  return database.clients.find(client => client.id === id) as Client | undefined;
};

// Get all partners
export const getAllPartners = (): Partner[] => {
  return database.partnerOrganizations as Partner[];
};

// Get partner by ID
export const getPartnerById = (id: string): Partner | undefined => {
  return database.partnerOrganizations.find(partner => partner.id === id) as Partner | undefined;
};

// Get all documents
export const getAllDocuments = (): Document[] => {
  const storedDocs = localStorage.getItem('documents');
  return storedDocs ? JSON.parse(storedDocs) : database.documents as Document[];
};

// Get documents by client ID
export const getDocumentsByClientId = (clientId: string): Document[] => {
  const allDocs = getAllDocuments();
  return allDocs.filter(doc => doc.clientId === clientId);
};

// Get document by ID
export const getDocumentById = (id: string): Document | undefined => {
  const allDocs = getAllDocuments();
  return allDocs.find(doc => doc.id === id);
};

// Get all activities
export const getAllActivities = (): Activity[] => {
  return database.activities as Activity[];
};

// Get stats
export const getStats = (): Stats => {
  return database.stats;
};

// Get verification trend data
export const getVerificationTrend = (): VerificationTrend[] => {
  return database.verificationTrend;
};

// Get document status data
export const getDocumentStatus = (): DocumentStatusData[] => {
  return database.documentStatus;
};

// Update document status
export const updateDocumentStatus = (
  documentId: string,
  status: 'approved' | 'rejected',
  reviewedBy: string,
  notes?: string
): Document | null => {
  // Get documents from localStorage or fallback to database
  const storedDocs = localStorage.getItem('documents');
  let documents = storedDocs ? JSON.parse(storedDocs) : [...database.documents];
  
  const docIndex = documents.findIndex((d: any) => d.id === documentId);
  if (docIndex !== -1) {
    const reviewDate = new Date();
    const expiryDate = new Date(reviewDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Documents expire after 1 year
    
    documents[docIndex] = {
      ...documents[docIndex],
      status,
      reviewedBy,
      reviewDate: reviewDate.toISOString().split('T')[0],
      expiryDate: status === 'approved' ? expiryDate.toISOString().split('T')[0] : undefined,
      reviewNotes: notes || documents[docIndex].reviewNotes
    };
    
    // Persist to localStorage
    localStorage.setItem('documents', JSON.stringify(documents));
    
    // Also update the in-memory database for current session
    const dbDoc = database.documents.find(d => d.id === documentId) as any;
    if (dbDoc) {
      dbDoc.status = status;
      dbDoc.reviewedBy = reviewedBy;
      dbDoc.reviewDate = reviewDate.toISOString().split('T')[0];
      if (status === 'approved') {
        dbDoc.expiryDate = expiryDate.toISOString().split('T')[0];
      }
      if (notes) {
        dbDoc.reviewNotes = notes;
      }
    }
    
    return documents[docIndex] as Document;
  }
  return null;
};

// Search clients
export const searchClients = (searchTerm: string, filterStatus?: string): Client[] => {
  let results = database.clients as Client[];
  
  if (searchTerm) {
    results = results.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (filterStatus && filterStatus !== 'all') {
    results = results.filter(client => client.status === filterStatus);
  }
  
  return results;
};

// Search partners
export const searchPartners = (searchTerm: string): Partner[] => {
  if (!searchTerm) return database.partnerOrganizations as Partner[];
  
  return database.partnerOrganizations.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.country.toLowerCase().includes(searchTerm.toLowerCase())
  ) as Partner[];
};

export default {
  getAllUsers,
  getUserByEmail,
  registerUser,
  authenticateUser,
  authenticateAdmin,
  authenticateCustomer,
  authenticatePartner,
  initializeUsers,
  initializeDocuments,
  getAllClients,
  getClientById,
  getAllPartners,
  getPartnerById,
  getAllDocuments,
  getDocumentsByClientId,
  getDocumentById,
  getAllActivities,
  getStats,
  getVerificationTrend,
  getDocumentStatus,
  updateDocumentStatus,
  searchClients,
  searchPartners,
};
