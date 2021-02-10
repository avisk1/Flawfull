const {app, BrowserWindow, globalShortcut } = require('electron');
const fs = require("fs");
const path = require('path');

const fileSystem = require("./Functions/fileSystem.js");

function getPath(file) {
  const appData = app.getPath("userData");
  const filePath = path.join(appData, file);
  return filePath;
}

const { ipcMain, dialog } = require("electron");




ipcMain.on("data-request", (event, arg) => {
  console.log("Request received!");
  ipcMain.on("window-data", (event2, arg2) => {
    console.log(arg2);
    // event.reply("window-data", arg);
    event.reply("data-request", arg2);
  })
})

ipcMain.on("keyboard-event", (event, arg) => {
  console.log("initialized successfully");
  ipcMain.on("keyboard-event-confirmed", (event2, arg2) => {
    console.log("we have the keyboard event");
    console.log(arg2);
    event.reply("keyboard-event", arg2);
  })
})

ipcMain.on("click-event", (event, arg) => {
  console.log("1");
  ipcMain.on("click-event-confirmed", (event2, arg2) => {
    console.log("2");
    event.reply("click-event", arg2);
  })
})

ipcMain.on("crash-report", (event, arg) => {
  dialog.showErrorBox("An error occurred", arg);
})

//for some reason something is getting messed up, fix
// ipcMain.on("openNewTab", (event, arg) => {
//   console.log("recieved")
//   event.reply("openNewTabRequest", arg);
// })
ipcMain.on("new-tab-request", (event, arg) => {
  console.log("new-tab-request");
  ipcMain.on("new-tab-request-confirmed", (event2, arg2) => {
    console.log("new-tab-request-confirmed");
    event.reply("new-tab-request", arg2);
  })
})

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
     // icon: "./icons/logo.png",
     // icon: "https://i.ibb.co/4pSfL6r/logo.png",
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
  win.webContents.send('window-data-reply', "TEST");
});
//This used to be 220 lines
