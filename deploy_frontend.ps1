# deploy_frontend.ps1
# Usage: .\deploy_frontend.ps1 -KeyPath "path\to\key.pem" -Host "ubuntu@your-server-ip"

param (
    [Parameter(Mandatory=$true)]
    [string]$KeyPath,

    [Parameter(Mandatory=$true)]
    [string]$HostAddress,

    [string]$RemotePath = "/var/www/hall-booking"
)

$ErrorActionPreference = "Stop"

# 1. Build Frontend Locally
Write-Host "1. Building Frontend Locally..." -ForegroundColor Cyan
Set-Location "frontend"
try {
    # Check if node_modules exists, install if not (optional, saves time if already there)
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing dependencies..."
        npm install
    }
    
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed."
    }
}
finally {
    Set-Location ..
}

# 2. Upload to Server
Write-Host "2. Uploading build artifacts to Server..." -ForegroundColor Cyan

# Create a temp directory for the upload
ssh -o StrictHostKeyChecking=no -i $KeyPath $HostAddress "mkdir -p $RemotePath/backend/public/temp_dist"

# Upload dist folder contents to temp location
# Note: scp -r frontend/dist uploads the 'dist' directory itself
scp -r -o StrictHostKeyChecking=no -i $KeyPath "frontend/dist" "$($HostAddress):$RemotePath/backend/public/temp_dist"

# Move contents from temp_dist/dist to public/ and cleanup
# We use cp -rT or cp -r with wildcards. 
# Safe approach: cp -r temp_dist/dist/* .
Write-Host "3. Applying changes on Server..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no -i $KeyPath $HostAddress "cp -r $RemotePath/backend/public/temp_dist/dist/* $RemotePath/backend/public/ && rm -rf $RemotePath/backend/public/temp_dist"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend Deployment Successful!" -ForegroundColor Green
    Write-Host "Your new settings UI should now be live."
} else {
    Write-Error "Deployment failed during server-side file movement."
}
