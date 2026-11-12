@echo off
title REDIS // NEON-CORE [TERMINAL CONSOLE ^& EXCEL ENGINE]
chcp 65001 > nul
color 0B
cd /d "%~dp0"

echo ======================================================================
echo   REDIS // NEON-CORE [TERMINAL CONSOLE ^& EXCEL ENGINE] v2.0
echo   Iniciando consola interactiva con soporte nativo de Excel...
echo ======================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python cli.py
) else (
    if exist "redis-cyberpunk.exe" (
        redis-cyberpunk.exe
    ) else (
        echo [!] Se requiere Python o el ejecutable redis-cyberpunk.exe para iniciar.
        pause
    )
)
