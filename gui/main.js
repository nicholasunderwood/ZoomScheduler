const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 880,
    height: 640,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('gui/index.html');
  console.log('load file')
}

app.whenReady().then(() => {
  console.log('ready')
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


ipcMain.on('edit task', (event, args) => {
  console.log(args);
});

ipcMain.on('install tasks', (event, args) => {
  
})