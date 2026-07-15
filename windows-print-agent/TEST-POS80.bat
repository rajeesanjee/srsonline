@echo off
title SRS POS80 Printer Test

cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Test-POS80.ps1"

exit /b
