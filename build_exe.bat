cd .\frontend\angularFrontEnd\
call ng build
cd ..\..\
call electron-packager ./ jeeklyMissionControl --platform=win32 --arch=x64 --overwrite