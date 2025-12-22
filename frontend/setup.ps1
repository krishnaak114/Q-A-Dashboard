# Quick Setup Script for Frontend

Write-Host "Setting up Hemut Q&A Dashboard Frontend..." -ForegroundColor Cyan

# Install dependencies
Write-Host "`nInstalling dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install

# Copy .env file if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "`nCopying .env.local.example to .env.local..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local
    Write-Host "Environment file created!" -ForegroundColor Green
}

Write-Host "`n✅ Frontend setup complete!" -ForegroundColor Green
Write-Host "`nTo start the development server, run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "`nApplication will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
