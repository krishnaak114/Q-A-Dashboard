# Quick Setup Script for Backend

Write-Host "Setting up Hemut Q&A Dashboard Backend..." -ForegroundColor Cyan

# Create virtual environment
Write-Host "`nCreating virtual environment..." -ForegroundColor Yellow
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Copy .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "`nCopying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "Please update .env with your configuration!" -ForegroundColor Green
}

Write-Host "`n✅ Backend setup complete!" -ForegroundColor Green
Write-Host "`nTo start the server, run:" -ForegroundColor Cyan
Write-Host "  python -m uvicorn app.main:app --reload" -ForegroundColor White
Write-Host "`nAPI will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:8000" -ForegroundColor White
Write-Host "  http://localhost:8000/docs (Interactive docs)" -ForegroundColor White
