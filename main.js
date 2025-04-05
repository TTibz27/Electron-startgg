console.log("'Ello Gov'nah!");
const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const auth = require('./auth.js');
const server = require('./src/backend/backend-main.js');
const env = require('./environments/env.json');

  
const iconPath = path.join(__dirname,  "favicon.ico");




const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      },
      icon: iconPath
  })
  win.loadFile('./src/frontend/angularFrontEnd/dist/angular-front-end/browser/index.html')
}



app.whenReady().then(() => {
  createWindow()
  let token = env.startggKey.trim();
  // if (envToken){
  //   envToken = envToken.trim();
  //   token = envToken;
  //   console.log("overriding default apikey");
  //
  // }


  console.log("token");
  console.log(token);
  console.log("env");
  console.log(env.env);
  ipcMain.handle('ping', () => 'pong')
  server.initServerMain(token);
})


