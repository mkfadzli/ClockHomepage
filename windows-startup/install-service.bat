@echo off
:: ================================================================
:: Alarm Timer — Windows Auto-Start Installer
:: ================================================================
:: This script installs a Windows Task Scheduler task that starts
:: the Docker container automatically at system boot.
::
:: Prerequisites:
::   1. Docker Desktop installed and set to "Start when Windows starts"
::   2. docker-compose.yml at the project root
::
:: Run this script once (as Administrator if possible):
::   .\windows-startup\install-service.bat
:: ================================================================

setlocal enabledelayedexpansion

echo.
echo   ============================================
echo     Alarm Timer — Auto-Start Installer
echo   ============================================
echo.

:: Resolve project root (two levels up from this script)
set "PROJECT_ROOT=%~dp0.."
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

echo   Project root: %PROJECT_ROOT%
echo.

:: ---- Check Docker ----
echo   [1/3] Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo   [FAIL] Docker is not running. Start Docker Desktop first.
    pause
    exit /b 1
)
echo   [OK] Docker is running.
echo.

:: ---- Pull / build ----
echo   [2/3] Ensuring image is up-to-date...
docker compose -f "%PROJECT_ROOT%\docker-compose.yml" build --pull
if %errorlevel% neq 0 (
    echo   [FAIL] Docker build failed.
    pause
    exit /b 1
)
echo   [OK] Image ready.
echo.

:: ---- Create Task Scheduler task ----
echo   [3/3] Creating scheduled task...

schtasks /create /tn "AlarmTimer" ^
  /tr "\"%PROJECT_ROOT%\windows-startup\docker-wait.bat\" \"%PROJECT_ROOT%\"" ^
  /sc onstart ^
  /ru SYSTEM ^
  /rl highest ^
  /f ^
  /np >nul 2>&1

if %errorlevel% neq 0 (
    echo   [WARN] Could not create task as SYSTEM (admin required).
    echo          Trying user-level task...

    schtasks /create /tn "AlarmTimer" ^
      /tr "\"%PROJECT_ROOT%\windows-startup\docker-wait.bat\" \"%PROJECT_ROOT%\"" ^
      /sc onlogon ^
      /f ^
      /np >nul 2>&1

    if %errorlevel% neq 0 (
        echo   [FAIL] Could not create scheduled task.
        pause
        exit /b 1
    )
    echo   [OK] Created user-logon task.
) else (
    echo   [OK] Created system-startup task.
)

:: ---- Start immediately ----
echo.
echo   Starting container now...
docker compose -f "%PROJECT_ROOT%\docker-compose.yml" up -d

echo.
echo   ============================================
echo     Installation complete.
echo.
echo     The alarm timer will start automatically
echo     when Windows boots.
echo.
echo     Manual controls:
echo       Start  : docker compose up -d
echo       Stop   : docker compose down
echo       Status : docker compose ps
echo   ============================================
echo.

pause
