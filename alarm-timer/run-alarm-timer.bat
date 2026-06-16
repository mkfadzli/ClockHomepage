@echo off
echo Starting Vite dev server...

cd /d "C:\Users\mkfad\OneDrive\Desktop\Vite\alarm-timer"

start cmd /k npm run dev

timeout /t 3 > nul

start http://localhost:5173