const {app, BrowserWindow, ipcMain} = require('electron')
const { DOMParser, XMLSerializer } = require('xmldom');
const { spawn } = require('child_process');
const path = require('path');
const fs = require("fs");

const installScript = require.resolve('../install.bat');

function editTasks(tasks) {
  let templateStr = fs.readFileSync('./tasks/template.xml', 'ucs2');
  let data = ''

  tasks.forEach(task => {
    console.log(task);
    const index = task.index;
    delete task.index
    const doc = parser.parseFromString(templateStr, 'text/xml');
    Object.keys(task).forEach(key => {
      el = doc.getElementsByTagName(key)[0];
      el.textContent = task[key];
    });

    let docStr = serializer.serializeToString(doc);
    fs.writeFileSync(`tasks/${index}.xml`, docStr, 'ucs2', () => { console.log('done', index); } );
  });

}

function installTasks() {
  var ls = spawn(installScript);

  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code);
  });
}

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

const parser = new DOMParser()
const serializer = new XMLSerializer()

ipcMain.on('edit tasks', (event, args) => {
  console.log('edit tasks', args);
  editTasks(args);
  event.returnValue = true;
});

ipcMain.on('install tasks', (event, args) => {
  console.log('install tasks', args);
  installTasks()
  event.returnValue = true
})

ipcMain.on('save data', (event, args) => {
  fs.writeFileSync('./data.json', JSON.stringify(args), 'utf-8');
  event.returnValue = true
});

ipcMain.on('load data', (event, args) => {
  event.reply('userData', JSON.parse(fs.readFileSync('./data.json', 'utf-8')))
})