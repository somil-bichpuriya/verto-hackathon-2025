# Complete End-to-End Test Suite
# Run this script to test all features

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:3000/api/v1"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "TEST: $Name" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    try {
        & $Test
        Write-Host "? PASS" -ForegroundColor Green
        $script:testsPassed++
    } catch {
        Write-Host "? FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
    }
}

Write-Host "??????????????????????????????????????????" -ForegroundColor Magenta
Write-Host "?  DOCUMENT & CONSENT SYSTEM TEST SUITE  ?" -ForegroundColor Magenta
Write-Host "??????????????????????????????????????????" -ForegroundColor Magenta
Write-Host ""

# ========================================
# 1. CUSTOMER REGISTRATION TESTS
# ========================================

Test-Endpoint "TC-001: Register New Customer" {
    $timestamp = Get-Date -Format "HHmmss"
    $body = @{
        companyName = "TestCo_$timestamp"
        email = "test$timestamp@company.com"
        address = "123 Test Street"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/register/customer" -Method POST -ContentType "application/json" -Body $body
    
    if (-not $response.data.customer.id) { throw "No customer ID returned" }
    if ($response.data.customer.email -ne "test$timestamp@company.com") { throw "Email mismatch" }
    
    $script:testCustomer = $response.data.customer
    Write-Host "  Customer created: $($testCustomer.email)"
}

# ========================================
# 2. PARTNER REGISTRATION TESTS
# ========================================

Test-Endpoint "TC-002: Register Partner with Document Types" {
    $timestamp = Get-Date -Format "HHmmss"
    $body = @{
        companyName = "PartnerCo_$timestamp"
        email = "partner$timestamp@corp.com"
        documentTypesConfig = @("Passport", "Certificate of Incorporation")
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/register/partner" -Method POST -ContentType "application/json" -Body $body
    
    if (-not $response.data.credentials.apiKey.StartsWith("verto_")) { throw "Invalid API key format" }
    if ($response.data.credentials.apiSecret.Length -ne 64) { throw "Invalid API secret length" }
    
    $script:testPartner = $response.data.partner
    $script:partnerApiKey = $response.data.credentials.apiKey
    $script:partnerApiSecret = $response.data.credentials.apiSecret
    
    Write-Host "  Partner created: $($testPartner.companyName)"
    Write-Host "  API Key: $($partnerApiKey.Substring(0,20))..."
}

# ========================================
# 3. CUSTOMER AUTHENTICATION TESTS
# ========================================

Test-Endpoint "TC-003: Customer Authentication with Valid Email" {
    $headers = @{"x-customer-email" = $testCustomer.email}
    $response = Invoke-RestMethod -Uri "$baseUrl/customer/documents" -Headers $headers
    
    if ($response.success -ne $true) { throw "Authentication failed" }
    Write-Host "  Customer authenticated successfully"
}

Test-Endpoint "TC-004: Customer Authentication with Invalid Email" {
    $headers = @{"x-customer-email" = "nonexistent@email.com"}
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/customer/documents" -Headers $headers
        throw "Should have failed with 401"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 401) {
            throw "Expected 401, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly rejected invalid customer"
}

# ========================================
# 4. PARTNER AUTHENTICATION TESTS
# ========================================

Test-Endpoint "TC-005: Partner Authentication with Valid Credentials" {
    $headers = @{
        "x-api-key" = $partnerApiKey
        "x-api-secret" = $partnerApiSecret
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/partner/me" -Headers $headers
    
    if ($response.data.partner.companyName -ne $testPartner.companyName) {
        throw "Partner name mismatch"
    }
    
    Write-Host "  Partner authenticated: $($response.data.partner.companyName)"
}

Test-Endpoint "TC-006: Partner Authentication with Invalid Credentials" {
    $headers = @{
        "x-api-key" = "verto_invalid"
        "x-api-secret" = "invalid"
    }
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/partner/me" -Headers $headers
        throw "Should have failed with 401"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 401) {
            throw "Expected 401, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly rejected invalid credentials"
}

# ========================================
# 5. DOCUMENT TYPE CREATION (PREREQUISITE)
# ========================================

Test-Endpoint "TC-007: Create Document Types (Admin)" {
    $docTypes = @("Passport", "Certificate of Incorporation", "Tax ID")
    
    foreach ($docType in $docTypes) {
        $body = @{
            name = $docType
            description = "$docType document"
            requiredFor = @("All")
        } | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri "$baseUrl/admin/document-types" -Method POST -ContentType "application/json" -Body $body | Out-Null
        } catch {
            # Already exists, that's fine
        }
    }
    
    Write-Host "  Document types ensured"
}

# ========================================
# 6. CUSTOMER DOCUMENT UPLOAD TESTS
# ========================================

Test-Endpoint "TC-009: Upload Document with Valid Type" {
    $headers = @{"x-customer-email" = $testCustomer.email}
    $body = @{
        documentType = "Passport"
        s3Link = "https://s3.example.com/passport-test-$((Get-Date).Ticks).pdf"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/customer/documents" -Method POST -ContentType "application/json" -Body $body -Headers $headers
    
    if ($response.data.document.isVerified -ne $false) { throw "Document should not be verified initially" }
    if (-not $response.data.document.id) { throw "No document ID returned" }
    
    $script:testDocument = $response.data.document
    Write-Host "  Document uploaded: $($testDocument.s3Link)"
}

Test-Endpoint "TC-010: Upload Document with Invalid Type" {
    $headers = @{"x-customer-email" = $testCustomer.email}
    $body = @{
        documentType = "NonExistentType"
        s3Link = "https://s3.example.com/invalid.pdf"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/customer/documents" -Method POST -ContentType "application/json" -Body $body -Headers $headers
        throw "Should have failed with 404"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 404) {
            throw "Expected 404, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly rejected invalid document type"
}

Test-Endpoint "TC-012: Upload Document Without Authentication" {
    $body = @{
        documentType = "Passport"
        s3Link = "https://s3.example.com/test.pdf"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/customer/documents" -Method POST -ContentType "application/json" -Body $body
        throw "Should have failed with 401"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 401) {
            throw "Expected 401, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly enforced authentication"
}

# ========================================
# 7. CUSTOMER DOCUMENT RETRIEVAL TESTS
# ========================================

Test-Endpoint "TC-013: Get All Customer Documents" {
    $headers = @{"x-customer-email" = $testCustomer.email}
    $response = Invoke-RestMethod -Uri "$baseUrl/customer/documents" -Headers $headers
    
    if ($response.data.documents.Count -lt 1) { throw "No documents returned" }
    
    Write-Host "  Retrieved $($response.data.documents.Count) document(s)"
}

# ========================================
# 8. PARTNER CONSENT GENERATION TESTS
# ========================================

Test-Endpoint "TC-014: Generate Consent Request for Valid Customer" {
    $headers = @{
        "x-api-key" = $partnerApiKey
        "x-api-secret" = $partnerApiSecret
    }
    $body = @{
        customerEmail = $testCustomer.email
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/partner/consent/generate" -Method POST -ContentType "application/json" -Body $body -Headers $headers
    
    if (-not $response.data.consentToken) { throw "No consent token returned" }
    if (-not $response.data.consentLink) { throw "No consent link returned" }
    if (-not $response.data.expiresAt) { throw "No expiration timestamp" }
    
    $script:consentToken = $response.data.consentToken
    Write-Host "  Consent token: $consentToken"
    Write-Host "  Expires: $($response.data.expiresAt)"
}

Test-Endpoint "TC-015: Generate Consent for Non-Existent Customer" {
    $headers = @{
        "x-api-key" = $partnerApiKey
        "x-api-secret" = $partnerApiSecret
    }
    $body = @{
        customerEmail = "nonexistent@test.com"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/partner/consent/generate" -Method POST -ContentType "application/json" -Body $body -Headers $headers
        throw "Should have failed with 404"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 404) {
            throw "Expected 404, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly rejected non-existent customer"
}

Test-Endpoint "TC-016: Generate Consent Without Partner Auth" {
    $body = @{
        customerEmail = $testCustomer.email
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/partner/consent/generate" -Method POST -ContentType "application/json" -Body $body
        throw "Should have failed with 401"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 401) {
            throw "Expected 401, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly enforced partner authentication"
}

# ========================================
# 9. CUSTOMER CONSENT VIEW TESTS
# ========================================

Test-Endpoint "TC-018: View Valid Consent Request" {
    $response = Invoke-RestMethod -Uri "$baseUrl/customer/consent/$consentToken"
    
    if (-not $response.data.consent.partnerName) { throw "No partner name" }
    if (-not $response.data.consent.customerName) { throw "No customer name" }
    if (-not $response.data.consent.documentTypesNeeded) { throw "No document types" }
    
    Write-Host "  Partner requesting: $($response.data.consent.partnerName)"
    Write-Host "  Documents needed: $($response.data.consent.documentTypesNeeded -join ', ')"
}

Test-Endpoint "TC-019: View Invalid Consent Token" {
    try {
        Invoke-RestMethod -Uri "$baseUrl/customer/consent/invalid-token-123"
        throw "Should have failed with 404"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 404) {
            throw "Expected 404, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly rejected invalid token"
}

# ========================================
# 10. CUSTOMER CONSENT GRANT TESTS
# ========================================

Test-Endpoint "TC-022: Grant Valid Consent" {
    $response = Invoke-RestMethod -Uri "$baseUrl/customer/consent/$consentToken/grant" -Method POST
    
    if (-not $response.data.consent.grantedAt) { throw "No grantedAt timestamp" }
    if ($response.data.consent.partner -ne $testPartner.companyName) { throw "Partner name mismatch" }
    
    Write-Host "  Consent granted at: $($response.data.consent.grantedAt)"
    Write-Host "  Partner: $($response.data.consent.partner)"
}

Test-Endpoint "TC-023: Grant Invalid Consent Token" {
    try {
        Invoke-RestMethod -Uri "$baseUrl/customer/consent/invalid-token/grant" -Method POST
        throw "Should have failed with 404"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 404) {
            throw "Expected 404, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly rejected invalid token"
}

Test-Endpoint "TC-025: Prevent Duplicate Consent Grant" {
    try {
        Invoke-RestMethod -Uri "$baseUrl/customer/consent/$consentToken/grant" -Method POST
        throw "Should have failed with 400"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 400) {
            throw "Expected 400, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly prevented duplicate grant"
}

# ========================================
# 11. PARTNER DOCUMENT ACCESS TESTS
# ========================================

Test-Endpoint "TC-027: Access Documents WITHOUT Consent (Different Partner)" {
    # Create a new partner without consent
    $timestamp = Get-Date -Format "HHmmss"
    $body = @{
        companyName = "NoConsentPartner_$timestamp"
        email = "noconsent$timestamp@corp.com"
        documentTypesConfig = @("Passport")
    } | ConvertTo-Json
    
    $newPartner = Invoke-RestMethod -Uri "$baseUrl/register/partner" -Method POST -ContentType "application/json" -Body $body
    
    $headers = @{
        "x-api-key" = $newPartner.data.credentials.apiKey
        "x-api-secret" = $newPartner.data.credentials.apiSecret
    }
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/partner/documents/$($testCustomer.email)" -Headers $headers
        throw "Should have failed with 403"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 403) {
            throw "Expected 403, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly blocked access without consent (403 Forbidden)"
}

Test-Endpoint "TC-026: Access Documents WITH Valid Consent" {
    $headers = @{
        "x-api-key" = $partnerApiKey
        "x-api-secret" = $partnerApiSecret
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/partner/documents/$($testCustomer.email)" -Headers $headers
    
    if (-not $response.data.customerEmail) { throw "No customer email in response" }
    if ($response.data.customerEmail -ne $testCustomer.email) { throw "Customer email mismatch" }
    
    Write-Host "  Successfully retrieved documents"
    Write-Host "  Customer: $($response.data.customerEmail)"
    Write-Host "  Document count: $($response.data.documentCount)"
}

Test-Endpoint "TC-029: Access Documents for Non-Existent Customer" {
    $headers = @{
        "x-api-key" = $partnerApiKey
        "x-api-secret" = $partnerApiSecret
    }
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/partner/documents/nonexistent@email.com" -Headers $headers
        throw "Should have failed with 404"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 404) {
            throw "Expected 404, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly rejected non-existent customer"
}

Test-Endpoint "TC-031: Access Documents Without Partner Authentication" {
    try {
        Invoke-RestMethod -Uri "$baseUrl/partner/documents/$($testCustomer.email)"
        throw "Should have failed with 401"
    } catch {
        if ($_.Exception.Response.StatusCode -ne 401) {
            throw "Expected 401, got $($_.Exception.Response.StatusCode)"
        }
    }
    
    Write-Host "  Correctly enforced partner authentication"
}

# ========================================
# SUMMARY
# ========================================

Write-Host "`n??????????????????????????????????????????" -ForegroundColor Magenta
Write-Host "?           TEST SUITE SUMMARY           ?" -ForegroundColor Magenta
Write-Host "??????????????????????????????????????????" -ForegroundColor Magenta
Write-Host ""
Write-Host "Total Tests Run: $($testsPassed + $testsFailed)" -ForegroundColor White
Write-Host "Tests Passed:    $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed:    $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "SOME TESTS FAILED" -ForegroundColor Red
    exit 1
}
