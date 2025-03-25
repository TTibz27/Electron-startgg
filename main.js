console.log("'Ello Gov'nah!");
const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const auth = require('./auth.js');
const server = require('./backend/backend-main.js');
  
const iconPath = path.join(__dirname,  "favicon.ico");



console.log(auth.token);
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      },
      icon: iconPath
  })
  win.loadFile('./frontend/angularFrontEnd/dist/angular-front-end/browser/index.html')
}



app.whenReady().then(() => {
  createWindow()
  ipcMain.handle('ping', () => 'pong')
  server.initServerMain(auth.startgg.token);
})


