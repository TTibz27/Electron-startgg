cd .\environments\
call node .\build_env_json.js dev
cd ..\

cd .\src\frontend\angularFrontEnd\
call ng build
cd ..\..\

@echo off
For /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set BUILD_DATE=%%a-%%b-%%c)
call npm run dev

