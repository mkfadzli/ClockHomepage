@echo off
setlocal enabledelayedexpansion
:: ================================================================
:: docker-wait.bat — Retry wrapper for Docker at system boot
::
:: Docker Desktop takes 10-30+ seconds to start its engine after
:: Windows login. This script polls `docker info` until it succeeds
:: (up to 2 minutes), then runs `docker compose up -d`.
::
:: Usage:
::   docker-wait.bat
::   docker-wait.bat C:\path\to\project
::
:: Replace the scheduled-task command with this script so the
:: container always starts reliably.
:: ================================================================

set "PROJECT_ROOT=%~dp0.."
if not "%~1"=="" set "PROJECT_ROOT=%~1"

pushd "%PROJECT_ROOT%" 2>nul || (
    echo [FAIL] Cannot access project root: %PROJECT_ROOT%
    exit /b 1
)

echo [%date% %time%] Waiting for Docker engine...

set RETRIES=0
set MAX_RETRIES=24

:wait_loop
    docker info >nul 2>&1
    if %errorlevel% equ 0 goto docker_ready

    set /a RETRIES+=1
    if !RETRIES! gtr %MAX_RETRIES% (
        echo [FAIL] Docker did not start after !MAX_RETRIES! attempts (2 min).
        popd
        exit /b 1
    )

    echo   Attempt !RETRIES!/%MAX_RETRIES% — Docker not ready, waiting 5s...
    timeout /t 5 /nobreak >nul
    goto wait_loop

:docker_ready
    echo [OK] Docker is running (attempt !RETRIES!).

    echo Starting Alarm Timer container...
    docker compose up -d

    if %errorlevel% neq 0 (
        echo [FAIL] docker compose up failed.
        popd
        exit /b 1
    )

    echo [OK] Alarm Timer container started.
    popd
    exit /b 0
