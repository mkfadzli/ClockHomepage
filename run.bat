@echo off
title Alarm Timer — Firefox Homepage
echo.
echo   ========================================
echo     Modern Alarm Clock + Search Dashboard
echo     Vite + React + Docker
echo   ========================================
echo.
echo   Choose launch mode:
echo     [1] Dev server (npm run dev)
echo     [2] Docker (docker compose up -d)
echo.
set /p MODE="Enter 1 or 2: "

if "%MODE%"=="2" goto docker

:dev
echo.
echo [1/2] Installing dependencies...
cd /d "%~dp0alarm-timer"
call npm install --silent
echo.
echo [2/2] Starting Vite dev server...
start "" http://localhost:5173
call npm run dev
pause
exit /b 0

:docker
echo.
echo Starting Docker container...
cd /d "%~dp0"
docker compose up -d
if %errorlevel% neq 0 (
    echo [FAIL] Docker command failed. Is Docker Desktop running?
    pause
    exit /b 1
)
echo.
echo Opening http://localhost:5173 ...
start "" http://localhost:5173
echo.
echo Container running. To stop: docker compose down
pause
