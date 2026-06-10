# Driven Fraud Detection Platform — Start Development Environment (Windows)
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "Starting Driven Fraud Detection Platform..." -ForegroundColor Cyan

# Backend
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location -LiteralPath '$Root\backend'; python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
) -WindowStyle Normal

Start-Sleep -Seconds 2

# Frontend (direct node invocation — avoids path issues with '&' on Windows)
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Set-Location -LiteralPath '$Root\frontend'; node '.\node_modules\vite\bin\vite.js'"
) -WindowStyle Normal

Write-Host ""
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor Green
Write-Host "  API Docs:  http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
