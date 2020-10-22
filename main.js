const {app, BrowserWindow, globalShortcut } = require('electron');
const fs = require("fs");
const path = require('path');

const fileSystem = require("./Functions/fileSystem.js");

function getPath(file) {
  const appData = app.getPath("userData");
  const filePath = path.join(appData, file);
  return filePath;
}

const { ipcMain } = require("electron");

const url = require('url');

const settingSystem = require("./Functions/settingSystem.js");

app.on('window-all-closed', app.quit);

let win;

//just let me change the stupid!!!!! ********** TITLE!!!!

function createWindow() {
  const { screen } = require("electron");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
   win = new BrowserWindow({
     width: width,
     height: height,
     icon: "./icons/hexagon24.png",
     webview: true,
     frame: false,
     title: "Flawfull",
     webPreferences: {
       nodeIntegration: true,
       enableRemoteModule: true,
       worldSafeExecuteJavaScript: true,
       webviewTag: true,
       spellcheck: true
     }
   });
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }));
}

app.on('ready', () => {
  createWindow();
});
//This used to be 220 lines
