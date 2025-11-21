# Test Cases for Document Management & Consent System

## Overview
This document contains comprehensive test cases for the customer document upload and partner consent workflow system.

---

## Test Environment Setup

### Prerequisites
- MongoDB running and connected
- Server running on `http://localhost:3000`
- API prefix: `/api/v1`

### Test Data Requirements
- Document Types: Passport, Certificate of Incorporation, Tax ID, ID Card
- Valid customer emails
- Valid partner API credentials

---

## 1. Customer Registration Tests

### TC-001: Register New Customer
**Endpoint:** `POST /api/v1/register/customer`

**Request Body:**
```json
{
  "companyName": "TestCompany",
  "email": "test@company.com",
  "address": "123 Test Street"
}
```

**Expected Result:**
- Status: 201
- Response contains customer ID, company name, email
- Customer stored in database

**Test Script:**
```powershell
$body = @{companyName="TestCompany";email="test@company.com";address="123 Test Street"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/register/customer" -Method POST -ContentType "application/json" -Body $body
Write-Host "Customer ID: $($response.data.customer.id)"
```

**Pass Criteria:**
- ✓ Status code is 201
- ✓ Response contains valid customer ID
- ✓ Email matches request

---

## 2. Partner Registration Tests

### TC-002: Register Partner with Document Types
**Endpoint:** `POST /api/v1/register/partner`

**Request Body:**
```json
{
  "companyName": "PartnerCorp",
  "email": "partner@corp.com",
  "documentTypesConfig": ["Passport", "Certificate of Incorporation"]
}
```

**Expected Result:**
- Status: 201
- Auto-generated API key (starts with "verto_")
- Auto-generated API secret (64 characters)
- Document types config stored

**Test Script:**
```powershell
$body = @{companyName="PartnerCorp";email="partner@corp.com";documentTypesConfig=@("Passport","Certificate of Incorporation")} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/register/partner" -Method POST -ContentType "application/json" -Body $body
Write-Host "API Key: $($response.data.credentials.apiKey)"
Write-Host "API Secret: $($response.data.credentials.apiSecret)"
```

**Pass Criteria:**
- ✓ Status code is 201
- ✓ API key starts with "verto_"
- ✓ API secret is 64 characters
- ✓ documentTypesConfig array returned

---

## 3. Customer Authentication Tests

### TC-003: Authenticate Customer with Valid Email
**Endpoint:** Any customer-protected endpoint
**Headers:** `x-customer-email: valid@email.com`

**Expected Result:**
- Authentication succeeds
- req.customer populated

**Test Script:**
```powershell
$headers = @{"x-customer-email"="test@company.com"}
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/customer/documents" -Headers $headers
```

**Pass Criteria:**
- ✓ No 401 error
- ✓ Customer context available

### TC-004: Authenticate Customer with Invalid Email
**Headers:** `x-customer-email: nonexistent@email.com`

**Expected Result:**
- Status: 401
- Error message: "Invalid customer credentials"

**Pass Criteria:**
- ✓ Status code is 401
- ✓ Error message present

---

## 4. Partner Authentication Tests

### TC-005: Authenticate Partner with Valid Credentials
**Endpoint:** `GET /api/v1/partner/me`
**Headers:** 
- `x-api-key: verto_xxxxx`
- `x-api-secret: xxxxxx`

**Expected Result:**
- Status: 200
- Partner details returned

**Test Script:**
```powershell
$headers = @{"x-api-key"=$apiKey;"x-api-secret"=$apiSecret}
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/partner/me" -Headers $headers
Write-Host "Partner: $($response.data.partner.companyName)"
```

**Pass Criteria:**
- ✓ Status code is 200
- ✓ Partner company name returned
- ✓ Document types config visible

### TC-006: Authenticate Partner with Invalid Credentials
**Headers:** 
- `x-api-key: invalid_key`
- `x-api-secret: invalid_secret`

**Expected Result:**
- Status: 401
- Error message: "Invalid API credentials"

**Pass Criteria:**
- ✓ Status code is 401
- ✓ Appropriate error message

---

## 5. Document Type Management Tests

### TC-007: Create Document Type (Admin)
**Endpoint:** `POST /api/v1/admin/document-types`

**Request Body:**
```json
{
  "name": "Passport",
  "description": "International passport document",
  "requiredFor": ["Partner1", "Partner2"]
}
```

**Expected Result:**
- Status: 201
- Document type created with unique name

**Pass Criteria:**
- ✓ Status code is 201
- ✓ Document type retrievable

### TC-008: Create Duplicate Document Type
**Request:** Same as TC-007 with existing name

**Expected Result:**
- Status: 409 or 400
- Error about duplicate

**Pass Criteria:**
- ✓ Duplicate rejected
- ✓ Appropriate error message

---

## 6. Customer Document Upload Tests

### TC-009: Upload Document with Valid Type
**Endpoint:** `POST /api/v1/customer/documents`
**Headers:** `x-customer-email: customer@test.com`

**Request Body:**
```json
{
  "documentType": "Passport",
  "s3Link": "https://s3.example.com/passport123.pdf"
}
```

**Expected Result:**
- Status: 201
- Document created and linked to customer
- isVerified: false by default

**Test Script:**
```powershell
$headers = @{"x-customer-email"="customer@test.com"}
$body = @{documentType="Passport";s3Link="https://s3.example.com/passport123.pdf"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/customer/documents" -Method POST -ContentType "application/json" -Body $body -Headers $headers
Write-Host "Document uploaded: $($response.data.document.id)"
```

**Pass Criteria:**
- ✓ Status code is 201
- ✓ Document ID returned
- ✓ isVerified is false
- ✓ uploadedAt timestamp present

### TC-010: Upload Document with Invalid Type
**Request Body:**
```json
{
  "documentType": "NonExistentType",
  "s3Link": "https://s3.example.com/doc.pdf"
}
```

**Expected Result:**
- Status: 404
- Error: "Document type 'NonExistentType' not found"

**Pass Criteria:**
- ✓ Status code is 404
- ✓ Error message accurate

### TC-011: Upload Duplicate Document Type for Customer
**Scenario:** Customer already has a Passport document

**Expected Result:**
- Status: 409
- Error: Document already exists

**Pass Criteria:**
- ✓ Status code is 409
- ✓ Duplicate prevented

### TC-012: Upload Document Without Authentication
**Headers:** None or invalid customer email

**Expected Result:**
- Status: 401
- Authentication error

**Pass Criteria:**
- ✓ Status code is 401

---

## 7. Customer Document Retrieval Tests

### TC-013: Get All Customer Documents
**Endpoint:** `GET /api/v1/customer/documents`
**Headers:** `x-customer-email: customer@test.com`

**Expected Result:**
- Status: 200
- Array of customer's documents
- Each document has: id, documentType, s3Link, isVerified, uploadedAt

**Test Script:**
```powershell
$headers = @{"x-customer-email"="customer@test.com"}
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/customer/documents" -Headers $headers
Write-Host "Document count: $($response.data.documents.Count)"
```

**Pass Criteria:**
- ✓ Status code is 200
- ✓ Documents array present
- ✓ Correct customer's documents only

---

## 8. Partner Consent Generation Tests

### TC-014: Generate Consent Request for Valid Customer
**Endpoint:** `POST /api/v1/partner/consent/generate`
**Headers:** Partner API credentials

**Request Body:**
```json
{
  "customerEmail": "customer@test.com"
}
```

**Expected Result:**
- Status: 201
- Unique UUID consent token
- Consent link URL
- Expiration timestamp (24 hours)

**Test Script:**
```powershell
$headers = @{"x-api-key"=$apiKey;"x-api-secret"=$apiSecret}
$body = @{customerEmail="customer@test.com"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/partner/consent/generate" -Method POST -ContentType "application/json" -Body $body -Headers $headers
Write-Host "Consent token: $($response.data.consentToken)"
Write-Host "Expires at: $($response.data.expiresAt)"
```

**Pass Criteria:**
- ✓ Status code is 201
- ✓ consentToken is valid UUID
- ✓ consentLink contains token
- ✓ expiresAt is ~24 hours in future

### TC-015: Generate Consent for Non-Existent Customer
**Request Body:**
```json
{
  "customerEmail": "nonexistent@test.com"
}
```

**Expected Result:**
- Status: 404
- Error: Customer not found

**Pass Criteria:**
- ✓ Status code is 404
- ✓ Appropriate error message

### TC-016: Generate Consent Without Partner Auth
**Headers:** Missing or invalid API credentials

**Expected Result:**
- Status: 401
- Authentication error

**Pass Criteria:**
- ✓ Status code is 401

### TC-017: Generate Duplicate Consent Request
**Scenario:** Partner already has active consent request for same customer

**Expected Result:**
- Status: 201
- Returns existing consent token (reuses)

**Pass Criteria:**
- ✓ Same token returned
- ✓ No duplicate created

---

## 9. Customer Consent View Tests

### TC-018: View Valid Consent Request
**Endpoint:** `GET /api/v1/customer/consent/:token`
**Authentication:** None required (public)

**Expected Result:**
- Status: 200
- Partner name
- Customer name
- Document types needed
- Expiration time

**Test Script:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/customer/consent/$consentToken"
Write-Host "Partner: $($response.data.consent.partnerName)"
Write-Host "Documents needed: $($response.data.consent.documentTypesNeeded -join ', ')"
```

**Pass Criteria:**
- ✓ Status code is 200
- ✓ Partner name visible
- ✓ Customer name visible
- ✓ Document types array present

### TC-019: View Invalid Consent Token
**Endpoint:** `GET /api/v1/customer/consent/invalid-token-123`

**Expected Result:**
- Status: 404
- Error: Invalid consent token

**Pass Criteria:**
- ✓ Status code is 404

### TC-020: View Expired Consent Token
**Scenario:** Token created >24 hours ago

**Expected Result:**
- Status: 410 (Gone)
- Error: Consent token has expired

**Pass Criteria:**
- ✓ Status code is 410
- ✓ Expiration message

### TC-021: View Already Granted Consent
**Scenario:** Consent already granted

**Expected Result:**
- Status: 400
- Error: Consent has already been granted

**Pass Criteria:**
- ✓ Status code is 400
- ✓ Appropriate message

---

## 10. Customer Consent Grant Tests

### TC-022: Grant Valid Consent
**Endpoint:** `POST /api/v1/customer/consent/:token/grant`
**Authentication:** None required (public)

**Expected Result:**
- Status: 200
- Consent marked as granted
- grantedAt timestamp
- Partner and customer names
- Document types granted

**Test Script:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/customer/consent/$consentToken/grant" -Method POST
Write-Host "Granted at: $($response.data.consent.grantedAt)"
Write-Host "Documents granted: $($response.data.consent.documentTypesGranted -join ', ')"
```

**Pass Criteria:**
- ✓ Status code is 200
- ✓ grantedAt timestamp present
- ✓ isGranted set to true in DB

### TC-023: Grant Invalid Consent Token
**Endpoint:** `POST /api/v1/customer/consent/invalid-token/grant`

**Expected Result:**
- Status: 404
- Error: Invalid consent token

**Pass Criteria:**
- ✓ Status code is 404

### TC-024: Grant Expired Consent
**Scenario:** Token expired

**Expected Result:**
- Status: 410
- Error: Consent token has expired

**Pass Criteria:**
- ✓ Status code is 410

### TC-025: Grant Already Granted Consent (Idempotency)
**Scenario:** Try to grant same consent twice

**Expected Result:**
- Status: 400
- Error: Consent has already been granted

**Pass Criteria:**
- ✓ Status code is 400
- ✓ No duplicate grant timestamp

---

## 11. Partner Document Access Tests

### TC-026: Access Documents WITH Valid Consent
**Endpoint:** `GET /api/v1/partner/documents/:customerEmail`
**Headers:** Partner API credentials
**Prerequisites:** 
- Customer has uploaded documents
- Consent granted

**Expected Result:**
- Status: 200
- Array of documents filtered by partner's documentTypesConfig
- Each document: documentType, s3Link, isVerified, uploadedAt

**Test Script:**
```powershell
$headers = @{"x-api-key"=$apiKey;"x-api-secret"=$apiSecret}
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/partner/documents/$customerEmail" -Headers $headers
Write-Host "Document count: $($response.data.documentCount)"
$response.data.documents | ForEach-Object {
  Write-Host "  - $($_.documentType): $($_.s3Link)"
}
```

**Pass Criteria:**
- ✓ Status code is 200
- ✓ Only document types in partner's config returned
- ✓ All fields present
- ✓ documentCount accurate

### TC-027: Access Documents WITHOUT Consent
**Scenario:** Partner tries to access customer documents without granted consent

**Expected Result:**
- Status: 403
- Error: "No consent granted"

**Test Script:**
```powershell
$headers = @{"x-api-key"=$apiKey;"x-api-secret"=$apiSecret}
try {
  Invoke-RestMethod -Uri "http://localhost:3000/api/v1/partner/documents/$customerEmail" -Headers $headers
} catch {
  Write-Host "Expected 403: $($_.Exception.Response.StatusCode)"
}
```

**Pass Criteria:**
- ✓ Status code is 403
- ✓ Error message about missing consent

### TC-028: Access Documents with Expired Consent
**Scenario:** Consent granted but expired

**Expected Result:**
- Status: 403
- Error: "Consent has expired"

**Pass Criteria:**
- ✓ Status code is 403
- ✓ Expiration message

### TC-029: Access Documents for Non-Existent Customer
**Endpoint:** `GET /api/v1/partner/documents/nonexistent@email.com`

**Expected Result:**
- Status: 404
- Error: Customer not found

**Pass Criteria:**
- ✓ Status code is 404

### TC-030: Document Filtering by Partner Config
**Scenario:**
- Customer has: Passport, Tax ID, Certificate of Incorporation
- Partner can access: Passport, Certificate of Incorporation
- Consent granted

**Expected Result:**
- Only Passport and Certificate returned
- Tax ID NOT included

**Pass Criteria:**
- ✓ Only allowed types returned
- ✓ Filtering works correctly

### TC-031: Access Documents Without Authentication
**Headers:** Missing API credentials

**Expected Result:**
- Status: 401
- Authentication error

**Pass Criteria:**
- ✓ Status code is 401

---

## 12. End-to-End Workflow Tests

### TC-032: Complete Consent Workflow
**Steps:**
1. Register customer
2. Register partner with document types
3. Customer uploads documents
4. Partner generates consent request
5. Customer views consent details
6. Customer grants consent
7. Partner accesses documents

**Expected Result:**
- All steps succeed
- Partner gets filtered documents

**Test Script:**
```powershell
# Complete workflow test
Write-Host "=== COMPLETE WORKFLOW TEST ===" -ForegroundColor Magenta

# 1. Register customer
$customer = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/register/customer" -Method POST -ContentType "application/json" -Body (@{companyName="E2ECustomer";email="e2e@test.com";address="123 St"} | ConvertTo-Json)
Write-Host "✓ Customer registered"

# 2. Register partner
$partner = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/register/partner" -Method POST -ContentType "application/json" -Body (@{companyName="E2EPartner";email="e2ep@test.com";documentTypesConfig=@("Passport")} | ConvertTo-Json)
Write-Host "✓ Partner registered"

# 3. Upload document
$doc = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/customer/documents" -Method POST -ContentType "application/json" -Body (@{documentType="Passport";s3Link="https://s3.example.com/passport.pdf"} | ConvertTo-Json) -Headers @{"x-customer-email"=$customer.data.customer.email}
Write-Host "✓ Document uploaded"

# 4. Generate consent
$consent = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/partner/consent/generate" -Method POST -ContentType "application/json" -Body (@{customerEmail=$customer.data.customer.email} | ConvertTo-Json) -Headers @{"x-api-key"=$partner.data.credentials.apiKey;"x-api-secret"=$partner.data.credentials.apiSecret}
Write-Host "✓ Consent requested"

# 5. View consent
$view = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/customer/consent/$($consent.data.consentToken)"
Write-Host "✓ Consent viewed: $($view.data.consent.partnerName)"

# 6. Grant consent
$grant = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/customer/consent/$($consent.data.consentToken)/grant" -Method POST
Write-Host "✓ Consent granted"

# 7. Access documents
$docs = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/partner/documents/$($customer.data.customer.email)" -Headers @{"x-api-key"=$partner.data.credentials.apiKey;"x-api-secret"=$partner.data.credentials.apiSecret}
Write-Host "✓ Documents accessed: $($docs.data.documentCount) documents"

Write-Host "✅ COMPLETE WORKFLOW PASSED" -ForegroundColor Green
```

**Pass Criteria:**
- ✓ All 7 steps complete successfully
- ✓ Documents accessible at the end

### TC-033: Multiple Partners Access Same Customer
**Scenario:**
- One customer
- Two partners with different document type configs
- Both have consent

**Expected Result:**
- Each partner sees only their allowed types
- No cross-contamination

**Pass Criteria:**
- ✓ Partner A sees correct subset
- ✓ Partner B sees correct subset
- ✓ Proper isolation

---

## 13. Security Tests

### TC-034: Partner Cannot Access Without Consent
**Already covered in TC-027**

### TC-035: Consent Token Cannot Be Reused After Expiry
**Already covered in TC-028**

### TC-036: Customer Email Authentication Required
**Test:** Try to upload document without x-customer-email header

**Expected Result:**
- Status: 401

**Pass Criteria:**
- ✓ Authentication enforced

### TC-037: Partner API Credentials Required
**Test:** Try partner endpoints without credentials

**Expected Result:**
- Status: 401

**Pass Criteria:**
- ✓ Authentication enforced

---

## 14. Data Validation Tests

### TC-038: Invalid Request Bodies
**Scenarios:**
- Missing required fields
- Invalid email formats
- Empty arrays
- Invalid data types

**Expected Result:**
- Status: 400
- Validation errors

**Pass Criteria:**
- ✓ Proper validation
- ✓ Clear error messages

### TC-039: SQL Injection Prevention
**Test:** Pass SQL injection strings in fields

**Expected Result:**
- Handled safely
- No database errors

**Pass Criteria:**
- ✓ No injection successful

---

## 15. Performance Tests

### TC-040: Load Test - Multiple Consent Requests
**Scenario:** Generate 100 consent requests rapidly

**Expected Result:**
- All succeed
- Reasonable response time (<500ms each)

**Pass Criteria:**
- ✓ No failures
- ✓ Performance acceptable

### TC-041: Large Document List Retrieval
**Scenario:** Customer with 50+ documents

**Expected Result:**
- All documents returned
- Response time <1s

**Pass Criteria:**
- ✓ Correct count
- ✓ Performance acceptable

---

## Test Execution Summary Template

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| TC-001 | Register Customer | ✓ PASS | |
| TC-002 | Register Partner | ✓ PASS | |
| TC-003 | Customer Auth Valid | ✓ PASS | |
| TC-004 | Customer Auth Invalid | ✓ PASS | |
| TC-005 | Partner Auth Valid | ✓ PASS | |
| TC-006 | Partner Auth Invalid | ✓ PASS | |
| TC-009 | Upload Document | ✓ PASS | |
| TC-014 | Generate Consent | ✓ PASS | |
| TC-018 | View Consent | ✓ PASS | |
| TC-022 | Grant Consent | ✓ PASS | |
| TC-026 | Access with Consent | ✓ PASS | |
| TC-027 | Access without Consent | ✓ PASS | 403 Forbidden |
| TC-032 | Complete Workflow | ✓ PASS | |

---

## Quick Test Execution Scripts

### Run All Basic Tests
```powershell
# Save this as run-all-tests.ps1
.\test-customer-registration.ps1
.\test-partner-registration.ps1
.\test-document-upload.ps1
.\test-consent-workflow.ps1
.\test-partner-access.ps1
```

### Individual Test Files

Each test file should follow this structure:
```powershell
Write-Host "=== Running Test: [Test Name] ===" -ForegroundColor Cyan
try {
    # Test logic here
    Write-Host "✓ PASS" -ForegroundColor Green
} catch {
    Write-Host "✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

## Coverage Summary

- **Authentication**: 6 tests
- **Customer Operations**: 5 tests
- **Partner Operations**: 5 tests  
- **Document Management**: 5 tests
- **Consent Workflow**: 12 tests
- **Partner Access**: 6 tests
- **End-to-End**: 2 tests
- **Security**: 4 tests
- **Performance**: 2 tests

**Total: 41+ Test Cases**

---

## Notes

- All timestamps are in ISO 8601 format
- Consent tokens expire after 24 hours
- MongoDB TTL index handles automatic cleanup of expired consents
- API keys are prefixed with "verto_"
- API secrets are 64 hex characters
- Customer authentication uses simple email header (POC)
- Partner authentication uses API key/secret headers
