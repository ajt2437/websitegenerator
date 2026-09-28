@echo off
rem Windows version of ./website  e.g.  website.cmd --name "Biz" --phone "+1 555 0100" --theme-color "#2563eb"
cd /d "%~dp0"
set PYTHONUTF8=1
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 tools\quick_site.py create %*
) else (
  python tools\quick_site.py create %*
)
