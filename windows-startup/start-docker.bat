@echo off
:: ================================================================
:: Quick Start — launches Docker container for the Alarm Timer
:: Run this instead of the Vite dev server for production mode.
:: ================================================================

cd /d "%~dp0.."

echo Starting Alarm Timer (Docker)...
docker compose up -d

echo.
echo Waiting for container to be healthy...
timeout /t 3 >nul

start http://localhost:5173

echo.
echo Container running at http://localhost:5173
echo To stop: docker compose down
echo.
pause
