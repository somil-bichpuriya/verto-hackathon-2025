# Seed Document Types for Testing

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SEEDING DOCUMENT TYPES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api/v1"

$documentTypes = @(
    @{
        name = "Passport"
        description = "Government-issued passport for identity verification"
    },
    @{
        name = "Certificate of Incorporation"
        description = "Official company registration document"
    },
    @{
        name = "Proof of Address"
        description = "Utility bill or bank statement for address verification"
    },
    @{
        name = "Tax ID Certificate"
        description = "Tax identification document"
    },
    @{
        name = "Bank Statement"
        description = "Recent bank statement for financial verification"
    }
)

foreach ($docType in $documentTypes) {
    Write-Host "Creating document type: $($docType.name)" -ForegroundColor Yellow
    
    try {
        $body = $docType | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/admin/document-types" -Method Post `
            -Body $body -ContentType "application/json"
        
        Write-Host "  SUCCESS" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 409) {
            Write-Host "  Already exists (skipped)" -ForegroundColor Gray
        } else {
            Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SEED COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
