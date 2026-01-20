# deploy_payment_mode_fix.ps1
# Deploy payment mode constraint fix to production
# Usage: .\deploy_payment_mode_fix.ps1 -KeyPath "path\to\key.pem" -HostAddress "ubuntu@server-ip"

param (
    [Parameter(Mandatory=$true)]
    [string]$KeyPath,

    [Parameter(Mandatory=$true)]
    [string]$HostAddress,

    [string]$RemotePath = "/var/www/hall-booking"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Payment Mode Fix to Production" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Upload Backend Migration Files
Write-Host "1. Uploading Backend Migration Files..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/database/migrations/2026_01_01_000000_create_all_tables.php" "$($HostAddress):$RemotePath/backend/database/migrations/2026_01_01_000000_create_all_tables.php"
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/database/migrations/2026_01_20_120000_fix_payment_mode_constraint.php" "$($HostAddress):$RemotePath/backend/database/migrations/2026_01_20_120000_fix_payment_mode_constraint.php"

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Migration files uploaded successfully!" -ForegroundColor Green
} else {
    Write-Error "   ✗ Failed to upload migration files"
    exit 1
}

# Step 2: Run Migration on Server
Write-Host ""
Write-Host "2. Running Database Migration on Server..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no -i $KeyPath $HostAddress "cd $RemotePath/backend && php artisan migrate --force"

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Migration executed successfully!" -ForegroundColor Green
} else {
    Write-Error "   ✗ Migration failed"
    exit 1
}

# Step 3: Build and Upload Frontend
Write-Host ""
Write-Host "3. Building Frontend Locally..." -ForegroundColor Yellow
Set-Location "frontend"
try {
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed"
    }
    Write-Host "   ✓ Frontend built successfully!" -ForegroundColor Green
}
finally {
    Set-Location ..
}

Write-Host ""
Write-Host "4. Uploading Frontend to Server..." -ForegroundColor Yellow

# Create temp directory
ssh -o StrictHostKeyChecking=no -i $KeyPath $HostAddress "mkdir -p $RemotePath/backend/public/temp_dist"

# Upload dist folder
scp -r -o StrictHostKeyChecking=no -i $KeyPath "frontend/dist" "$($HostAddress):$RemotePath/backend/public/temp_dist"

# Move to public directory
ssh -o StrictHostKeyChecking=no -i $KeyPath $HostAddress "cp -r $RemotePath/backend/public/temp_dist/dist/* $RemotePath/backend/public/ && rm -rf $RemotePath/backend/public/temp_dist"

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Frontend deployed successfully!" -ForegroundColor Green
} else {
    Write-Error "   ✗ Frontend deployment failed"
    exit 1
}

# Step 5: Clear Server Cache
Write-Host ""
Write-Host "5. Clearing Server Cache..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no -i $KeyPath $HostAddress "cd $RemotePath/backend && php artisan config:clear && php artisan cache:clear"

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Cache cleared successfully!" -ForegroundColor Green
} else {
    Write-Error "   ✗ Failed to clear cache"
    exit 1
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Changes deployed:" -ForegroundColor Cyan
Write-Host "  • Database constraint updated (6 payment modes)" -ForegroundColor White
Write-Host "  • Web frontend updated (6 payment options)" -ForegroundColor White
Write-Host "  • Existing data migrated (bank → bank_transfer, check → cheque)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test booking creation at https://app.mthall.com" -ForegroundColor White
Write-Host "  2. Try adding payments with different payment modes" -ForegroundColor White
Write-Host "  3. Rebuild and redeploy mobile app (see mobile/README.md)" -ForegroundColor White
Write-Host ""
Write-Host "The payment mode error should now be fixed!" -ForegroundColor Green
