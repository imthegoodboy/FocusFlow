# Frontend Installation Fix Script
# Run this in PowerShell from the frontend directory

Write-Host "=== Frontend Installation Fix ===" -ForegroundColor Green

# Install TypeScript types for js-cookie
Write-Host "`nInstalling @types/js-cookie..." -ForegroundColor Yellow
npm install --save-dev @types/js-cookie

Write-Host "`n=== Installation Complete ===" -ForegroundColor Green
Write-Host "`nTo build, run:" -ForegroundColor Cyan
Write-Host "  npm run build" -ForegroundColor White
Write-Host "`nTo run dev server:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White

