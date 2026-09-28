@echo off
rem Windows version of "Open Dashboard.command" - serves the contact-sheet dashboard
cd /d "%~dp0"
set PYTHONUTF8=1
start "" http://127.0.0.1:4310
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 tools\control.py serve --port 4310
) else (
  python tools\control.py serve --port 4310
)
