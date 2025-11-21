# Verto Admin API Documentation

## Overview
This API provides endpoints for Verto admin management, including document types, customers, partners, and document verification.

## Base URL
```
http://localhost:3000/api/v1
```

## Admin Endpoints

### Document Types

#### Create Document Type
```http
POST /api/v1/admin/document-types
Content-Type: application/json

{
  "name": "Certificate of Incorporation",
  "description": "Official certificate proving company incorporation",
  "requiredFor": ["partner1", "partner2"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Document type created successfully",
  "data": {
    "_id": "...",
    "name": "Certificate of Incorporation",
    "description": "Official certificate proving company incorporation",
    "requiredFor": ["partner1", "partner2"],
    "createdAt": "2025-11-21T...",
    "updatedAt": "2025-11-21T..."
  }
}
```

#### Get All Document Types
```http
GET /api/v1/admin/document-types
```

---

### Customers

#### Get All Customers
```http
GET /api/v1/admin/customers
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "companyName": "Acme Corp",
      "email": "contact@acme.com",
      "address": "123 Main St, City, Country",
      "createdAt": "2025-11-21T..."
    }
  ]
}
```

#### Get Customer by ID
```http
GET /api/v1/admin/customers/:id
```

---

### Partners

#### Get All Partners
```http
GET /api/v1/admin/partners
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "companyName": "Partner Corp",
      "email": "partner@corp.com",
      "apiKey": "verto_abc123...",
      "documentTypesConfig": ["Certificate of Incorporation", "Director's ID"],
      "isActive": true,
      "createdAt": "2025-11-21T..."
    }
  ]
}
```

**Note:** `apiSecret` is never returned in responses for security.

#### Get Partner by ID
```http
GET /api/v1/admin/partners/:id
```

---

### Documents

#### Get All Documents
```http
GET /api/v1/admin/documents
```

**Query Parameters:**
- `customerId` (optional): Filter by customer ID
- `documentType` (optional): Filter by document type name
- `isVerified` (optional): Filter by verification status (true/false)

**Example:**
```http
GET /api/v1/admin/documents?isVerified=false&documentType=Certificate%20of%20Incorporation
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "customer": {
        "_id": "...",
        "companyName": "Acme Corp",
        "email": "contact@acme.com"
      },
      "documentType": "Certificate of Incorporation",
      "s3Link": "https://s3.amazonaws.com/bucket/file.pdf",
      "isVerified": false,
      "uploadedAt": "2025-11-21T...",
      "verifiedBy": null,
      "verifiedAt": null
    }
  ]
}
```

#### Get Document by ID
```http
GET /api/v1/admin/documents/:id
```

#### Verify Document
```http
PUT /api/v1/admin/documents/:id/verify
Content-Type: application/json
X-Admin-Id: 67123abc456def789

OR

{
  "adminId": "67123abc456def789"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Document verified successfully",
  "data": {
    "_id": "...",
    "customer": {
      "_id": "...",
      "companyName": "Acme Corp",
      "email": "contact@acme.com"
    },
    "documentType": "Certificate of Incorporation",
    "s3Link": "https://s3.amazonaws.com/bucket/file.pdf",
    "isVerified": true,
    "uploadedAt": "2025-11-21T...",
    "verifiedBy": {
      "_id": "...",
      "username": "admin_john",
      "role": "admin"
    },
    "verifiedAt": "2025-11-21T..."
  }
}
```

---

### Dashboard

#### Get Dashboard Statistics
```http
GET /api/v1/admin/dashboard/stats
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 25,
    "totalPartners": 8,
    "totalDocuments": 150,
    "verifiedDocuments": 120,
    "pendingDocuments": 30,
    "totalDocumentTypes": 12,
    "verificationRate": "80.00%"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "statusCode": 400
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error",
  "statusCode": 500
}
```

---

## Data Models

### DocumentType
- `name`: string (unique, required)
- `description`: string (required)
- `requiredFor`: string[] (optional)

### Customer
- `companyName`: string (unique, required)
- `email`: string (unique, required)
- `address`: string (required)

### Partner
- `companyName`: string (unique, required)
- `email`: string (unique, required)
- `apiKey`: string (auto-generated, unique)
- `apiSecret`: string (auto-generated, never returned)
- `documentTypesConfig`: string[]
- `isActive`: boolean (default: true)

### CustomerDocument
- `customer`: ObjectId (ref: Customer)
- `documentType`: string (document type name)
- `s3Link`: string (file location)
- `isVerified`: boolean (default: false)
- `uploadedAt`: Date
- `verifiedBy`: ObjectId (ref: VertoAdmin, optional)
- `verifiedAt`: Date (optional)

### VertoAdmin
- `username`: string (unique, required)
- `passwordHash`: string (required, never returned)
- `role`: enum ['super_admin', 'admin', 'verifier', 'viewer']
- `isActive`: boolean (default: true)
- `lastLogin`: Date (optional)

---

## Testing with cURL

### Create a Document Type
```bash
curl -X POST http://localhost:3000/api/v1/admin/document-types \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Certificate of Incorporation",
    "description": "Official certificate proving company incorporation",
    "requiredFor": ["partner1"]
  }'
```

### Get All Customers
```bash
curl http://localhost:3000/api/v1/admin/customers
```

### Get All Partners
```bash
curl http://localhost:3000/api/v1/admin/partners
```

### Get All Documents (Unverified)
```bash
curl "http://localhost:3000/api/v1/admin/documents?isVerified=false"
```

### Verify a Document
```bash
curl -X PUT http://localhost:3000/api/v1/admin/documents/67123abc456/verify \
  -H "Content-Type: application/json" \
  -H "X-Admin-Id: 67123xyz789" \
  -d '{}'
```

### Get Dashboard Stats
```bash
curl http://localhost:3000/api/v1/admin/dashboard/stats
```
