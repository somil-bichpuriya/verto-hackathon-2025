# Quick Test Script for Admin API

# Test 1: Health Check
Write-Host "`n=== Testing Health Check ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/health"

# Test 2: Create Document Type
Write-Host "`n`n=== Creating Document Type ===" -ForegroundColor Cyan
$documentTypeData = @{
    name = "Certificate of Incorporation"
    description = "Official certificate proving company incorporation and registration"
    requiredFor = @("partner1", "partner2")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/document-types" `
  -Method POST `
  -ContentType "application/json" `
  -Body $documentTypeData

# Test 3: Create Another Document Type
Write-Host "`n`n=== Creating Another Document Type ===" -ForegroundColor Cyan
$documentType2Data = @{
    name = "Director's ID"
    description = "Government-issued identification document for company directors"
    requiredFor = @("partner1")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/document-types" `
  -Method POST `
  -ContentType "application/json" `
  -Body $documentType2Data

# Test 4: Get All Document Types
Write-Host "`n`n=== Getting All Document Types ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/document-types"

# Test 5: Get All Customers
Write-Host "`n`n=== Getting All Customers ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/customers"

# Test 6: Get All Partners
Write-Host "`n`n=== Getting All Partners ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/partners"

# Test 7: Get All Documents
Write-Host "`n`n=== Getting All Documents ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/documents"

# Test 8: Get Dashboard Stats
Write-Host "`n`n=== Getting Dashboard Stats ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/dashboard/stats"

Write-Host "`n`n=== All Tests Complete ===" -ForegroundColor Green
