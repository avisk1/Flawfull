// async function hi() {
//   await test;
//   return test;
// }
const fs = require("fs");
const os = require('os');

const { remote } = require("electron");

const { app, Menu, MenuItem, shell } = remote;


const { Titlebar, Color } = require('custom-electron-titlebar');



//DO NOT CHANGE THIS TO OBJECT DESTRUCTURING

const modalSystem = require("./Functions/modalSystem.js");
const fileSystem = require("./Functions/fileSystem.js");
const generalSystem = require("./Functions/generalSystem.js");
const appF = require("./Functions/appSystem.js");
const dataSystem = require("./Functions/dataSystem.js");
const buttonSystem = require("./Functions/buttonSystem.js");
const domSystem = require("./Functions/domSystem.js");
const searchSystem = require("./Functions/searchSystem.js");
const settingSystem = require("./Functions/settingSystem.js");
const bugSystem = require("./Functions/bugSystem.js");

const { autoUpdater } = remote.require('electron-updater');

autoUpdater.autoDownload = false;

autoUpdater.on("update-available", () => {
  console.log("Update available");
  const restartOnClick = () => {
    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
      const error = document.getElementById("error");
      error.innerHTML = "";
      autoUpdater.downloadUpdate();
    });
  }
  const restartModal = modalSystem.createModal(`
    <h4>Flawfull is ready to update</h4>
    <h5 id="progress"></h5>
    <h5 id="error" style="color: red !important"></h5>
    <button id="restart">Update</button>
  `, restartOnClick, true, true);
  autoUpdater.on("update-downloaded", () => {
    console.log("Update has been downloaded");
    setImmediate(() => {
      autoUpdater.quitAndInstall(false, true);
    })
    // autoUpdater.quitAndInstall(false, true);
  });
  autoUpdater.on("download-progress", (progress, bps, percent, total, transferred) => {
    var progress = document.getElementById("progress");
    progress.innerHTML = "Download: " + percent + "%";
  })
});
autoUpdater.on("update-not-available", () => {
  console.log("Update not available!");
})

autoUpdater.on("error", (err) => {
  // const error = document.getElementById("error");
  // error.innerHTML = "Sorry, but there has been an error. Please close Flawfull and try again.";
  alert(err.message);
  console.error(err);
})

autoUpdater.checkForUpdates();





// alert("this will happen and it'll kinda suck. not the real at all");
// alert("Crap, this is the actual one you want to see ;(");

const { ipcRenderer } = require("electron");


//creating settings if it doesn't exist

if (!fs.existsSync(settingSystem.getSettingsPath())) {
  fs.appendFileSync(settingSystem.getSettingsPath(), JSON.stringify(settingSystem.defaultSettings));
  console.log(`${settingSystem.getSettingsPath()} created`);
  appF.openSettings();
} else {
  const settings = fileSystem.getFile(settingSystem.getSettingsPath());
  for (let i = 0; i < Object.keys(settingSystem.defaultSettings).length; i++) {
    if (!(Object.keys(settingSystem.defaultSettings)[i] in settings)) {
      fileSystem.setFileProperty(settingSystem.getSettingsPath(), Object.keys(settingSystem.defaultSettings)[i], settingSystem.defaultSettings[Object.keys(settingSystem.defaultSettings)[i]]);
    }
  }
}

if (bugSystem.getBug()) appF.restart();

// console.log(process.env);
console.log(app.getVersion());

console.log("new!");

// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   if (arg == "true") {
//     const restartOnClick = () => {
//       const restartButton = document.getElementById("restart");
//       restartButton.addEventListener("click", () => {
//         console.log("clicked!");
//         ipcRenderer.send("asynchronous-message", "consent-to-update");
//       });
//     }
//     const restartModal = modalSystem.createModal(`
//       <h4>Flawfull is ready to update</h4>
//       <button id="restart">Update</button>
//     `, restartOnClick, true, true);
//   }
// })
//
// ipcRenderer.send('asynchronous-message', 'update?');



// console.log(config);
// //DO THIS!!!!
//
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg);
//   console.log(fileSystem.getFile(settingSystem.getSettingsPath()).justUpdated);
//   console.log(arg.updateInfo.version);
//   // const settings = fileSystem.getFile(settingSystem.getSettingsPath());
//   if (arg.updateInfo.version !== app.getVersion()) {
//     //if the latest version is not equal to the app's version
//     //not up to date
//     fileSystem.setFileProperty(settingSystem.getSettingsPath(), "justUpdated", "true");
//     // config.justUpdated = true;
//     alert("You are not up to date. After you close this window, everything should update and you will receieve a cool message! (Hopefully)");
//   } else if ((fileSystem.getFile(settingSystem.getSettingsPath()).justUpdated === "true" || fileSystem.getFile(settingSystem.getSettingsPath()).justUpdated == true) && arg.updateInfo.version === app.getVersion()) {
//     alert("You just updated! Congratulations!");
//     fileSystem.setFileProperty(settingSystem.getSettingsPath(), "justUpdated", "false");
//   }
//   // if (arg) {
//   //   alert("Freaking update available >:(");
//   // } else {
//   //   alert("No updates");
//   // }
// })
//
// ipcRenderer.send('asynchronous-message', 'update?');

// if (ipcRenderer.sendSync('synchronous-message', 'uptate?')) {
//   alert("Update available (test)");
//   const updates = modalSystem.createModal(`
//
//   `);
// } else {
//   alert("There's no update today!");
// }




console.log("%cLEAVE", "color:red; font-weight: bold");



//removes default menu/shortcuts
Menu.setApplicationMenu(null);

//REMOVE || TRUE!!!!
// if (app.getVersion() == "1.2.3926" || true) {
//   function eventListeners() {
//
//   }
//   modalSystem.createModal(`
//     <h4>Flawfull has successfully been installed. Please wait for a notification
//   `, null, true, true);
// }






//============================================> ALL EVENT LISTENERS HERE <============================================

const updateButton = document.getElementById("update-button");
updateButton.addEventListener("click", () => {
  appF.openUpdates();
})

let previousKeys = [];
let keyCombo = "";

document.body.addEventListener("keydown", (e) => {
    previousKeys.push(e.which);
    keyCombo = previousKeys.join("+");
    // if (e.which === 123) { //F12
    //   require('electron').remote.getCurrentWindow().toggleDevTools();
    //   previousKeys = [];
    if (keyCombo.includes("17+16+73")) { //ctrl shift i
      require("electron").remote.getCurrentWindow().toggleDevTools();
      previousKeys = [];
    } else if (keyCombo.includes("17+82")) { //r
      location.reload();
      previousKeys = [];
    }
});

document.title = "";

console.log(`User info: ${os.userInfo()}`);
console.log(`Platform info: ${os.platform()}`);
console.log(`Home directory: ${os.homedir()}`);
console.log(`OS CPU Architecture: ${os.arch()}`);

const allButtons = [...document.getElementsByTagName("BUTTON")];

// document.body.addEventListener("mousedown", (e) => submitButtonClick(e, "#003d82", "#146dd1"));
// document.body.addEventListener("mouseup", (e) => submitButtonClick(e, "#146dd1", "#003d82"));

// document.body.addEventListener("click", (e) => submitButton(e));

function submitButtonClick(e, gradient1, gradient2) {
  if (e.target.classList.contains("submit")) {
    const btn = e.target;
    btn.style.backgroundImage = `linear-gradient(${gradient1}, ${gradient2})`;
    btn.style.outline = "transparent";
  }
}






const menu = new Menu();

const session = { };

session.settings = settingSystem.getSettings();

//MAIN FUNCTION ↓↓↓
function main() {
  // if (generalSystem.emptyObj(session.settings)) { //if settings is empty
  //   appF.openSettings();
  // }

  //append search.js to document and remove it from html file

  //default tasks
  if (session.settings) {
    for (let i = 0; i < Object.keys(session.settings).length; i++) {
      const currentSetting = Object.keys(session.settings)[i];
      if (currentSetting) {
        appF.settingFunctions[i];
      } else {
        console.warn("Issue with current setting");
      }
    }
  }

  const newTab = searchSystem.newTab();


}


//
// function submitSettings(btn) {
//   btn.blur();
//
//   const inputContainers = [...btn.parentNode.getElementsByClassName("input-container")];
//   inputContainers.forEach((container) => {
//     const input = container.getElementsByClassName("modal-input")[0];
//     fileSystem.setFileProperty("./settings.json", input.id, input.value)
//   })
//
//   //                        container  modalContent modal
//   // const modalContainer = btn.parentNode.parentNode.parentNode;
//   // modal.closeModal(modalContainer);
// }



menu.append(new MenuItem({
  label: `Flawfull`,
  submenu: [
    {
      label: "About",
      type: "normal",
      click: () => appF.openAbout()
    }, {
      label: "Privacy",
      type: "normal",
      click: () => appF.openPrivacy()
    }, {
      label: "Settings",
      type: "normal",
      click: () => appF.openSettings()
    }, {
      label: "Help",
      type: "submenu",
      submenu: [
        {
          label: "Feedback",
          type: "normal",
          click: () => appF.openFeedback()
        }, {
          label: "Report a Bug",
          type: "normal",
          click: () => appF.openBugReport()
        }
      ]
    }, {
      label: "Updates",
      type: "normal",
      click: () => appF.openUpdates()
    }, {
      label: "Restart",
      type: "normal",
      click: () => appF.restart()
    }, {
      label: "Quit",
      type: "normal",
      click: () => appF.quit()
    }
  ]

}));

//Loading Screen ↓↓↓
const circleList = [...document.getElementsByClassName("circle-container")[0].children];
const title = document.getElementsByClassName("title-container")[0].children[0];
title.style.color = "white";
const loadingScreenContent = document.getElementsByClassName("loading-screen-content")[0];
const loadingScreen = document.getElementsByClassName("loading-screen")[0];
let circle = 0;
let times = 0;
var load = setInterval(() => {
	if (circleList[circle].style.backgroundColor == "transparent") {
    	circleList[circle].style.backgroundColor = "white";
    } else {
    	circleList[circle].style.backgroundColor = "transparent";
    }
    circle++;
    if (circle == circleList.length) {
      circle = 0;
      times++;
      if (times == 1) {
        for (let i = 0; i < circleList.length; i++) {
          circleList[i].style.color = "transparent";
        }
        title.style.color = "transparent";
        setTimeout(() => {
          title.parentNode.removeChild(title);
          for (let i = 0; i < circleList.length; i++) {
            circleList[i].parentNode.removeChild(circleList[i]);
          }
          setTimeout(() => {
            loadingScreenContent.style.backgroundColor = "transparent";
            setTimeout(() => {
              loadingScreenContent.parentNode.removeChild(loadingScreenContent);
            }, 800);
            main();
          }, 1500);
        }, 1500);
        clearInterval(load);
      }
    }
}, 500);






const bar = new Titlebar({
    backgroundColor: Color.fromHex('#0079c2'),
    icon: "./icons/hexagon24.png",
    shadow: true,
    menu: menu
});
