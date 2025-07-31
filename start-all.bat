@echo off
REM Windows batch script to run backend and frontend

REM Start backend server
start "Backend" cmd /k "cd back-end-rest-server && node server.js"

REM Start frontend app
start "Frontend" cmd /k "cd front-end-app && npm run dev"

echo Both backend and frontend are starting in separate windows.
pause
