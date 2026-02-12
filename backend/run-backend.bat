@echo off
echo Cleaning and installing the project...
call mvn clean install
if %errorlevel% neq 0 (
    echo Maven install failed.
    exit /b %errorlevel%
)
echo Starting the Spring Boot application...
call mvn spring-boot:run
