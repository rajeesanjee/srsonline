@echo off
setlocal

title SRS Print Agent

cd /d "%~dp0"

echo.
echo ========================================
echo  STARTING SRS PRINT AGENT
echo ========================================
echo.

powershell.exe ^
  -NoLogo ^
  -NoProfile ^
  -ExecutionPolicy Bypass ^
  -File "%~dp0SRS-Print-Agent.ps1"

echo.
echo ========================================
echo  SRS PRINT AGENT STOPPED
echo ========================================
echo.

pause

endlocal
