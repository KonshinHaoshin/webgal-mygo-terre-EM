@echo off
setlocal

set RUN_FROM_CLICK=0
echo %CMDCMDLINE% | find /I "/c" >nul && set RUN_FROM_CLICK=1
if %RUN_FROM_CLICK%==1 (
  cmd /k "%~f0" --keep %*
  exit /b
)

if /i "%1"=="--keep" shift
set PAUSE_ON_EXIT=1
if /i "%1"=="--nopause" set PAUSE_ON_EXIT=0

set ROOT=%~dp0
cd /d "%ROOT%"

REM Optional: pin yarn 1.x via corepack if available.
where corepack >nul 2>nul
if %errorlevel%==0 (
  call corepack prepare yarn@1.22.22 --activate
)

call yarn install
if errorlevel 1 goto :error

pushd packages\terre2
call yarn build-standalone
if errorlevel 1 goto :error
call yarn pkg
if errorlevel 1 goto :error
popd

pushd packages\origine2
call yarn build
if errorlevel 1 goto :error
popd

REM Copy frontend dist into backend public
robocopy packages\origine2\dist packages\terre2\public /E
if %errorlevel% GEQ 8 goto :error

REM Create a runnable local bundle
set OUTDIR=release-local
if not exist "%OUTDIR%" mkdir "%OUTDIR%"
copy /Y packages\terre2\dist\WebGAL_Terre.exe "%OUTDIR%\" >nul
robocopy packages\terre2\assets "%OUTDIR%\assets" /E
if %errorlevel% GEQ 8 goto :error
robocopy packages\terre2\public "%OUTDIR%\public" /E
if %errorlevel% GEQ 8 goto :error

echo Done. Output: %OUTDIR%\WebGAL_Terre.exe
if %PAUSE_ON_EXIT%==1 pause
exit /b 0

:error
echo Build failed. See the output above.
if %PAUSE_ON_EXIT%==1 pause
exit /b 1
