const { remote } = require('electron');
const { DOMParser, XMLSerializer } = require('xmldom');
const fs = require("fs");
const { parse } = require('path');
const { spawn } = require('child_process');

const installScript = require.resolve('../install.bat');

function editTasks(tasks) {
  let templateStr = fs.readFileSync('./tasks/template.xml', 'ucs2');

  tasks.forEach(task => {
    console.log(task);
    const index = task.index
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

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
});

const parser = new DOMParser()
const serializer = new XMLSerializer()

window.editTasks = editTasks
window.installTasks = installTasks