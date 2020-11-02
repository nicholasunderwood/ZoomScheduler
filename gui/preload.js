const { remote } = require('electron');
// const { DOMParser } = require('xmldom');
// const fs = require("fs");

function editTask(args) {
  console.log(args);
  fs.loadFile('../tasks/0.xml', 'utf-8', (err, data) => {
    console.log(data);
  })
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


// window.editTask = editTask