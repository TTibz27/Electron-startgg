rm .\token.json

cd .\environments\
call node .\build_env_json.js admin
cd ..\

cd .\src\frontend\angularFrontEnd\
call ng build
cd ..\..\..\

call electron-packager ./ jeeklyMissionControlAdmin --platform=win32 --arch=x64 --overwrite

cd .\environments\
call node .\build_env_json.js mod
cd ..\

cd .\src\frontend\angularFrontEnd\
call ng build
cd ..\..\..\

call electron-packager ./ jeeklyMissionControlMod --platform=win32 --arch=x64 --overwrite



