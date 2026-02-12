@echo off
echo ========================================== > install_log.txt
echo Reinstall Log - Direct Attempt >> install_log.txt
echo ========================================== >> install_log.txt

echo Setting registry to default...
call npm config set registry https://registry.npmjs.org/

echo Removing package-lock.json...
if exist "package-lock.json" del /f /q "package-lock.json"

echo Removing node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules"
)

echo Installing dependencies...
echo Output will be captured to install_log.txt
call npm install --no-audit --no-fund --loglevel=error >> install_log.txt 2>&1

if %errorlevel% neq 0 (
    echo INSTALLATION FAILED.
    echo Please ask AI to check the log.
) else (
    echo INSTALLATION SUCCESSFUL.
)
pause
