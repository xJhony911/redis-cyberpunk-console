@echo off
title REDIS // NEON-CORE [TERMINAL CONSOLE & EXCEL ENGINE]
chcp 65001 > nul
color 0B
cd /d "%~dp0"

echo ======================================================================
echo   REDIS // NEON-CORE [TERMINAL CONSOLE & EXCEL ENGINE] v2.0
echo   Iniciando consola interactiva con soporte nativo de Excel...
echo ======================================================================
echo.

if exist "redis-cyberpunk.exe" (
    redis-cyberpunk.exe
) else (
    python cli.py
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Presiona cualquier tecla para salir...
    pause > nul
)
