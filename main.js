const {app, BrowserWindow, globalShortcut } = require('electron');
const fs = require("fs");
const path = require('path');


// const dataSystem = require("./Functions/dataSystem.js");
const fileSystem = require("./Functions/fileSystem.js");

function getPath(file) {
  const appData = app.getPath("userData");
  const filePath = path.join(appData, file);
  return filePath;
}

function writeConsole(message) {
  fileSystem.appendText(getPath("console.txt"), message);
}




const { ipcMain } = require("electron");

console.log('test');

writeConsole("test");

// autoUpdater.on("update-available", () => {
//   writeConsole("Update available");
//   autoUpdater.downloadUpdate();
//   autoUpdater.on("update-downloaded", () => {
//     writeConsole("Update has been downloaded");
//     autoUpdater.quitAndInstall(false, true);
//   })
// });
// autoUpdater.on("update-not-available", () => {
//   writeConsole("Update not available!");
// })
//
// autoUpdater.on("error", (err) => {
//   writeConsole(JSON.stringify(err));
// })

// try {
// ipcMain.on("asynchronous-message", (event, arg) => {
//   // console.log("recieved asynchronous message");
//   writeConsole("recieved asynchronous message : 19");
//   if (arg === "update?") {
//     autoUpdater.on("update-not-available", () => {
//       event.reply("asynchronous-reply", "false");
//     });
//     autoUpdater.on("update-available", () => {
//       writeConsole("update available! : 25");
//       //the update is downloaded for sure
//       const download = autoUpdater.downloadUpdate();
//       download.catch((err) => {
//         console.error(err);
//         writeConsole(JSON.stringify(err));
//       });
//       writeConsole(JSON.stringify(download));
//       (async () => {
//         await download;
//         writeConsole(JSON.stringify(download));
//         // console.log(download);
//       })();
//       event.reply("asynchronous-reply", "true");
//     });
//     try {
//
//       autoUpdater.checkForUpdates();
//     } catch (err) {
//       writeConsole(JSON.stringify(err));
//     }
//   } else if (arg === "consent-to-update") {
//     // console.log("Received message 'consent-to-update'");
//     writeConsole("Recieved message 'consent-to-update'");
//     autoUpdater.on("update-downloaded", () => {
//       // console.log("Quitting and installing now, and update-download event has been called");
//       writeConsole("Quitting and installing now, and update-download event has been called");
//       try {
//         autoUpdater.quitAndInstall(false, true);
//       } catch (err) {
//         writeConsole(JSON.stringify(err));
//       }
//     });
//   } else {
//     writeConsole("You're sending the wrong message you idiot!");
//     console.error("ERROR - NO VALID MESSAGE KEY");
//   }
// })
// } catch (err) {
//   writeConsole(JSON.stringify(err));
// }



//
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log("this api is crap");
//   // console.log(autoUpdater.checkForUpdates());
//   console.log("Freak this");
//   (async () => {
//     const freakthis = autoUpdater.checkForUpdates();
//     freakthis.then((crap) => {
//       console.log(crap);
//       event.reply("asynchronous-reply", crap);
//     })
//     freakthis.catch((err) => {
//       event.reply("asynchronous-reply", err);
//     });
//     /*ipcMain.on("asynchronous-message", (event, arg) => {
//       //arg literally does not matter, so forget about it
//       autoUpdater.on("update-available", (info) => {
//         fileSystem.setFileProperty(settingSystem.getSettingsPath(), "justUpdated", "true");
//         event.reply("asynchronous-reply", info);
//       });
//       autoUpdater.on("update-not-available", (info) => {
//         if (fileSystem.getFile(settingSystem.getSettingsPath()).justUpdated == "true") {
//           event.reply("asynchronous-reply", "You just updated, didn't you?");
//           fileSystem.setFileProperty(settingSystem.getSettingsPath(), "justUpdated", "false");
//         } else {
//           event.reply("asynchronous-reply", info);
//         }
//       });
//       autoUpdater.checkForUpdates();
//     })
// */
//   })();
// })


// autoUpdater.checkForUpdatesAndNotify();



// const appF = require("./Functions/appSystem.js");

const url = require('url');


const settingSystem = require("./Functions/settingSystem.js");

let config;



app.on('window-all-closed', app.quit);



// app.on("ready", () => {
//   globalShortcut.register('CommandOrControl+W', () => {
//     fileSystem.appendText("textInput.txt", "W");
//   })
// })

function setShortcuts() {
  // globalShortcut.unregister("W");
}

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
     /*transparent: true,*/
     webPreferences: {
       nodeIntegration: true,
       enableRemoteModule: true,
       worldSafeExecuteJavaScript: true,
       webviewTag: true,
       spellcheck: true
     }
     /*titleBarStyle: "hidden",*/
   });
   // win.setSize(width, height);
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }));
}

app.on('ready', () => {
  // if (!fs.existsSync("./config.json")) {
  //   //config.json
  //   fs.appendFileSync("./config.json", `{
  //     "width": 800,
  //     "height": 800,
  //     "icon": "./icons/hexagon2.png",
  //     "title": "Flawfull"
  //   }`);
  //   console.log(`${__dirname}\\config.json created`);
  // }



  //../settings.js to get something one folder up

  // config = fileSystem.getFile("./config.json");

  let testing;






  createWindow();
  // setShortcuts();
});
