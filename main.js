const {app, BrowserWindow, ipcMain} = require('electron')
const { DOMParser, XMLSerializer } = require('xmldom');
const { spawn } = require('child_process');
const path = require('path');
const fs = require("fs");

const installScript = require.resolve(__dirname + '/install.bat');
const templateStr = fs.readFileSync(__dirname + '/tasks/template.xml', 'ucs2');

var mainWindow, msg;

function editTasks(tasks) {

  tasks.forEach(task => {
    console.log(task);
    const index = task.index;
    delete task.index
    const doc = parser.parseFromString(templateStr, 'text/xml');
    Object.keys(task).forEach(key => {
      let el = doc.getElementsByTagName(key)[0];
      el.textContent = task[key];
    });
    doc.getElementsByTagName('Command')[0].textContent = __dirname + '\\launch.bat'

    let docStr = serializer.serializeToString(doc);
    fs.writeFileSync(__dirname + `/tasks/${index}.xml`, docStr, 'ucs2', () => { console.log('done', index); } );
  });

}

function installTasks() {
  var ls = spawn(installScript);

  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    ipcMain.emit('process', 'stdout: ' + data);
    msg += 'stdout: ' + data + '\n';
  });

  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    ipcMain.emit('process', 'stderr: ' + data);
    msg += 'stderr: ' + data + '\n';
  });

  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    ipcMain.emit('process', 'child process exited with code ' + code);
    msg += 'child process exited with code ' + code + '\n';
    mainWindow.webContents.send('tasks installed', msg)
  });
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 880,
    height: 640,
    minWidth: 800,
    show: false,
    title: "Zoom Scheduler",
    webPreferences: {
      preload: path.join(__dirname + '/gui', 'preload.js'),
      nodeIntegration: true
    }
  })

  mainWindow.once('ready-to-show', () => mainWindow.show());
  // mainWindow.removeMenu();
  
  mainWindow.loadFile('gui/index.html');
  console.log('load file');
}

if (require('electron-squirrel-startup')) return app.quit();

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
  event.reply('tasks created');
});

ipcMain.on('install tasks', (event, args) => {
  msg = '';
  console.log('install tasks', args);
  installTasks()
  // event.reply('tasks installed', msg);
})

ipcMain.on('save data', (event, args) => {
  fs.writeFileSync(__dirname + '/data.json', JSON.stringify(args), 'utf-8');
  event.returnValue = true
  event.reply('data saved');
});

ipcMain.on('load data', (event, args) => {
  let userData = JSON.parse(fs.readFileSync(__dirname + '\\data.json', 'utf-8'));
  event.reply('userData', JSON.parse(fs.readFileSync(__dirname + '\\data.json', 'utf-8')))
});

ipcMain.on('launch', (event, args) => {
  console.log(args)
  let launch = spawn('schtasks', ['/run', '/tn \\Zoom\\'+args], {'shell': true});  
});