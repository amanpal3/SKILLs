@echo off
REM ============================================================
REM Dr-SKILLs 🩺⚡ — Portable Installer Launcher
REM Watermark: Curated by Aman Pal • MIT License
REM ============================================================
REM Usage:
REM   install-skills.bat                    → Save & install all skills globally (default)
REM   install-skills.bat store              → Save & install all skills globally
REM   install-skills.bat install            → Install into current dir
REM   install-skills.bat install C:\myapp   → Install into specific project
REM ============================================================
powershell -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0install-skills.ps1" %*
pause
