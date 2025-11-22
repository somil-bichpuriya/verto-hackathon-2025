// Fake data service for Vice International demo
export interface FakeCustomer {
  id: string;
  companyName: string;
  email: string;
  contactName: string;
  contactPhone: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  documentsSubmitted: number;
  totalDocumentsRequired: number;
  industry: string;
  country: string;
}

export interface FakeDocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: string;
}

export interface FakeDashboardMetrics {
  totalCustomers: number;
  activeCustomers: number;
  pendingCustomers: number;
  totalDocuments: number;
  documentsUploaded: number;
  documentsPending: number;
  monthlyRevenue: number;
  conversionRate: number;
}

export interface FakeCustomerDocument {
  id: string;
  documentType: string;
  s3Link: string;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  uploadedAt: string;
}

export interface FakeConsentRequest {
  _id: string;
  customerEmail?: string;
  partner: {
    companyName: string;
    email: string;
  };
  documentTypesRequested: string[];
  isGranted: boolean;
  grantedAt: string | null;
  expiresAt: string;
}

// Seeded random data for Vice International
const companyNames = [
  'Global Tech Solutions Ltd',
  'Innovative Finance Corp',
  'Premier Logistics Group',
  'Advanced Manufacturing Inc',
  'Digital Commerce Partners',
  'Sustainable Energy Systems',
  'Healthcare Innovations LLC',
  'Financial Services Alliance',
  'Technology Ventures Group',
  'International Trade Partners',
  'Smart City Developments',
  'Renewable Resources Ltd',
  'Professional Services Network',
  'E-commerce Solutions Inc',
  'Data Analytics Partners'
];

const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Maria'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const industries = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Logistics', 'Energy', 'Retail', 'Consulting', 'Real Estate', 'Education'];
const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia', 'Japan', 'Singapore', 'Netherlands', 'Switzerland'];

const documentTypes = [
  { name: 'Certificate of Incorporation', description: 'Official company registration document', category: 'Legal' },
  { name: 'Articles of Association', description: 'Company bylaws and operational rules', category: 'Legal' },
  { name: 'Business License', description: 'Local business operation permit', category: 'Regulatory' },
  { name: 'Tax Identification Number', description: 'Official tax registration document', category: 'Tax' },
  { name: 'Bank Statement', description: 'Recent bank account statement', category: 'Financial' },
  { name: 'Financial Statements', description: 'Annual financial reports', category: 'Financial' },
  { name: 'Proof of Address', description: 'Utility bill or lease agreement', category: 'Identity' },
  { name: 'Director ID Documents', description: 'Identification for company directors', category: 'Identity' },
  { name: 'Insurance Certificate', description: 'Business liability insurance', category: 'Compliance' },
  { name: 'Trade License', description: 'Industry-specific operating license', category: 'Regulatory' }
];

// Generate seeded random customers for Vice International
export const fakeCustomers: FakeCustomer[] = [
  // Specific customer that matches login credentials
  {
    id: 'cust_demo',
    companyName: 'Global Tech Solutions Ltd',
    email: 'customer@gmail.com',
    contactName: 'John Smith',
    contactPhone: '+1-555-0123',
    status: 'active',
    createdAt: '2024-10-15',
    documentsSubmitted: 4,
    totalDocumentsRequired: 5,
    industry: 'Technology',
    country: 'United States'
  },
  // Other seeded customers
  ...Array.from({ length: 14 }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const status = ['active', 'active', 'active', 'pending', 'inactive'][Math.floor(Math.random() * 5)] as 'active' | 'pending' | 'inactive';
    const documentsRequired = 3 + Math.floor(Math.random() * 4); // 3-6 documents
    const documentsSubmitted = status === 'active' ? documentsRequired : Math.floor(Math.random() * documentsRequired);

    return {
      id: `cust_${index + 2}`,
      companyName,
      email: `contact@${companyName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
      contactName: `${firstName} ${lastName}`,
      contactPhone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      status,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      documentsSubmitted,
      totalDocumentsRequired: documentsRequired,
      industry,
      country
    };
  })
];

// Generate seeded random document types for Vice International
export const fakeDocumentTypes: FakeDocumentType[] = documentTypes.slice(0, 8).map((doc, index) => ({
  id: `doc_${index + 1}`,
  name: doc.name,
  description: doc.description,
  required: index < 5, // First 5 are required
  category: doc.category
}));

// Seeded dashboard metrics for Vice International
export const fakeDashboardMetrics: FakeDashboardMetrics = {
  totalCustomers: fakeCustomers.length,
  activeCustomers: fakeCustomers.filter(c => c.status === 'active').length,
  pendingCustomers: fakeCustomers.filter(c => c.status === 'pending').length,
  totalDocuments: fakeCustomers.reduce((sum, c) => sum + c.totalDocumentsRequired, 0),
  documentsUploaded: fakeCustomers.reduce((sum, c) => sum + c.documentsSubmitted, 0),
  documentsPending: fakeCustomers.reduce((sum, c) => sum + (c.totalDocumentsRequired - c.documentsSubmitted), 0),
  monthlyRevenue: 125000 + Math.floor(Math.random() * 75000), // $125K - $200K
  conversionRate: 68 + Math.floor(Math.random() * 22) // 68-90%
};

// Seeded chart data for Vice International
export const fakeChartData = {
  customerGrowth: [
    { month: 'Jan', customers: 8 },
    { month: 'Feb', customers: 12 },
    { month: 'Mar', customers: 15 },
    { month: 'Apr', customers: 18 },
    { month: 'May', customers: 22 },
    { month: 'Jun', customers: fakeCustomers.length },
  ],
  documentStatus: [
    { status: 'Uploaded', count: fakeDashboardMetrics.documentsUploaded, color: '#48bb78' },
    { status: 'Pending', count: fakeDashboardMetrics.documentsPending, color: '#ed8936' },
    { status: 'Missing', count: Math.floor(fakeDashboardMetrics.documentsPending * 0.3), color: '#f56565' },
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 95000 },
    { month: 'Feb', revenue: 112000 },
    { month: 'Mar', revenue: 128000 },
    { month: 'Apr', revenue: 145000 },
    { month: 'May', revenue: 158000 },
    { month: 'Jun', revenue: fakeDashboardMetrics.monthlyRevenue },
  ]
};

// Static customer documents for demo
export const fakeCustomerDocuments: FakeCustomerDocument[] = [
  {
    id: 'doc_1',
    documentType: 'Certificate of Incorporation',
    s3Link: '#',
    isVerified: true,
    verifiedBy: 'John Smith',
    verifiedAt: '2024-11-15T10:30:00Z',
    uploadedAt: '2024-11-10T09:15:00Z'
  },
  {
    id: 'doc_2',
    documentType: 'Business License',
    s3Link: '#',
    isVerified: true,
    verifiedBy: 'Sarah Johnson',
    verifiedAt: '2024-11-14T14:20:00Z',
    uploadedAt: '2024-11-12T11:45:00Z'
  },
  {
    id: 'doc_3',
    documentType: 'Tax Identification Number',
    s3Link: '#',
    isVerified: false,
    verifiedBy: null,
    verifiedAt: null,
    uploadedAt: '2024-11-18T16:30:00Z'
  },
  {
    id: 'doc_4',
    documentType: 'Financial Statements',
    s3Link: '#',
    isVerified: false,
    verifiedBy: null,
    verifiedAt: null,
    uploadedAt: '2024-11-20T13:15:00Z'
  }
];

// Static document types for customer upload
export const fakeCustomerDocumentTypes: FakeDocumentType[] = [
  {
    id: 'doc_type_1',
    name: 'Certificate of Incorporation',
    description: 'Official company registration document',
    required: true,
    category: 'Legal'
  },
  {
    id: 'doc_type_2',
    name: 'Business License',
    description: 'Local business operation permit',
    required: true,
    category: 'Regulatory'
  },
  {
    id: 'doc_type_3',
    name: 'Tax Identification Number',
    description: 'Official tax registration document',
    required: true,
    category: 'Tax'
  },
  {
    id: 'doc_type_4',
    name: 'Financial Statements',
    description: 'Annual financial reports',
    required: false,
    category: 'Financial'
  },
  {
    id: 'doc_type_5',
    name: 'Proof of Address',
    description: 'Utility bill or lease agreement',
    required: false,
    category: 'Identity'
  }
];

// Static consent requests for demo
export const fakeConsentRequests: FakeConsentRequest[] = [
  {
    _id: 'consent_1',
    customerEmail: 'customer@gmail.com',
    partner: {
      companyName: 'Vice International',
      email: 'partner@viceinternational.com'
    },
    documentTypesRequested: ['Certificate of Incorporation', 'Business License', 'Tax Identification Number'],
    isGranted: true,
    grantedAt: '2024-11-15T10:30:00Z',
    expiresAt: '2025-11-15T10:30:00Z'
  },
  {
    _id: 'consent_2',
    customerEmail: 'contact@innovativefinancecorp.com',
    partner: {
      companyName: 'Global Finance Corp',
      email: 'partner@globalfinance.com'
    },
    documentTypesRequested: ['Financial Statements', 'Tax Identification Number'],
    isGranted: false,
    grantedAt: null,
    expiresAt: '2025-12-01T00:00:00Z'
  }
];