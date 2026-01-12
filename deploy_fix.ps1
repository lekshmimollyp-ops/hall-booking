# deploy_fix.ps1
# Usage: .\deploy_fix.ps1 -KeyPath "path\to\key.pem" -Host "ubuntu@your-server-ip"

param (
    [Parameter(Mandatory=$true)]
    [string]$KeyPath,

    [Parameter(Mandatory=$true)]
    [string]$HostAddress,

    [string]$RemotePath = "/var/www/hall-booking"
)

$ErrorActionPreference = "Stop"

Write-Host "1. Uploading cors.php, api.php, ForceCors.php, app.php and ReportController.php..." -ForegroundColor Cyan
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/config/cors.php" "$($HostAddress):$RemotePath/backend/config/cors.php"
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/routes/api.php" "$($HostAddress):$RemotePath/backend/routes/api.php"
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/app/Http/Middleware/ForceCors.php" "$($HostAddress):$RemotePath/backend/app/Http/Middleware/ForceCors.php"
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/bootstrap/app.php" "$($HostAddress):$RemotePath/backend/bootstrap/app.php"
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/app/Http/Controllers/ReportController.php" "$($HostAddress):$RemotePath/backend/app/Http/Controllers/ReportController.php"
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/app/Http/Controllers/CenterController.php" "$($HostAddress):$RemotePath/backend/app/Http/Controllers/CenterController.php"
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/app/Models/Center.php" "$($HostAddress):$RemotePath/backend/app/Models/Center.php"
scp -o StrictHostKeyChecking=no -i $KeyPath "backend/database/migrations/2026_01_12_085044_add_theme_colors_to_centers_table.php" "$($HostAddress):$RemotePath/backend/database/migrations/2026_01_12_085044_add_theme_colors_to_centers_table.php"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Upload successful!" -ForegroundColor Green
} else {
    Write-Error "Upload failed. Please check your KeyPath and HostAddress."
}

Write-Host "2. Clearing Server Cache..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no -i $KeyPath $HostAddress "cd $RemotePath/backend && php artisan config:clear && php artisan cache:clear && php artisan migrate --force"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Cache cleared successfully!" -ForegroundColor Green
    Write-Host "Deployment Complete. Please wait 1 minute and test the mobile app." -ForegroundColor Green
} else {
    Write-Error "Failed to clear cache."
}
