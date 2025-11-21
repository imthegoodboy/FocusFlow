# Backend Installation Fix Script
# Run this in PowerShell from the backend directory

Write-Host "=== Backend Installation Fix ===" -ForegroundColor Green

# Step 1: Uninstall incorrect bson package
Write-Host "`n1. Removing incorrect bson package..." -ForegroundColor Yellow
pip uninstall bson -y

# Step 2: Upgrade pip
Write-Host "`n2. Upgrading pip..." -ForegroundColor Yellow
python.exe -m pip install --upgrade pip

# Step 3: Install pymongo first (which includes bson)
Write-Host "`n3. Installing pymongo (includes bson)..." -ForegroundColor Yellow
pip install pymongo==4.6.0

# Step 4: Try to install other dependencies
Write-Host "`n4. Installing other dependencies..." -ForegroundColor Yellow
pip install fastapi==0.104.1
pip install "uvicorn[standard]==0.24.0"
pip install "python-jose[cryptography]==3.3.0"
pip install "passlib[bcrypt]==1.7.4"
pip install python-multipart==0.0.6
pip install python-dotenv==1.0.0
pip install bcrypt==4.1.2
pip install email-validator==2.1.0

# Step 5: Install pydantic (try latest version with pre-built wheels)
Write-Host "`n5. Installing pydantic..." -ForegroundColor Yellow
pip install pydantic pydantic-settings --upgrade

Write-Host "`n=== Installation Complete ===" -ForegroundColor Green
Write-Host "`nTo run the server, use:" -ForegroundColor Cyan
Write-Host "  uvicorn main:app --reload" -ForegroundColor White
Write-Host "`nOr:" -ForegroundColor Cyan
Write-Host "  python main.py" -ForegroundColor White

