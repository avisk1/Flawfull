const modalSystem = require("./modalSystem.js");
const domSystem = require("./domSystem.js");
const dataSystem = require("./dataSystem.js");
const searchSystem = require("./searchSystem.js");
const fileSystem = require("./fileSystem.js");
const settingSystem = require("./settingSystem.js");
const bugSystem = require("./bugSystem.js");

const remote = require('electron').remote;
const { ipcRenderer } = require("electron");
const { getElementsByTagName } = require("custom-electron-titlebar/lib/common/dom");
const { appendFile } = require("fs");
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const app = remote.app;

const browserWindow = require("electron").remote.getCurrentWindow();

// ipcRenderer.on("openNewTabRequest", (event, arg) => {
//   exports.openLink(arg);
//   console.log("SUCCESS");
// })

// ipcRenderer.send("data-request", "please work");

//  searchData = new Promise((resolve, reject) => {
//     ipcRenderer.on("data-request", (event, arg) => {
//       resolve(arg);
//     })
//   })

ipcRenderer.send("new-tab-request", "please work");

ipcRenderer.on("new-tab-request", (event, arg) => {
  // alert("OH YEAH!!!");
  // alert(arg);
  console.log("what?");
  exports.openLink(arg);
})

exports.restart = () => {
  //relaunches the app and then promptly exits it, restarting
  app.relaunch();
  app.exit();
}

exports.openAppMenu = () => {
  //context menu
  var menu = new Menu();

  //About
  menu.append(new MenuItem({
    label: "About",
    click: () => {
      exports.openAbout()
    },
  }))
  //Privacy
  menu.append(new MenuItem({
    label: "Privacy",
    click: () => {
      exports.openPrivacy()
    },
  }))
  //Settings
  menu.append(new MenuItem({
    label: "Settings",
    click: () => {
      exports.openSettings()
    },
  }))
  //Help
  menu.append(new MenuItem({
    label: "Report an issue",
    click: () => exports.openFeedback()
  }))
  menu.append(new MenuItem({
    label: "Request a Feature",
    click: () => exports.openRequests()
  }))
  //Updates
  menu.append(new MenuItem({
    label: "Updates",
    click: () => exports.openUpdates()
  }))
  //Changelog
  menu.append(new MenuItem({
    label: "Changelog",
    click: () => exports.openChangelog()
  }))
  //Restart
  menu.append(new MenuItem({
    label: "Restart",
    click: () => exports.restart()
  }))
  //Quit
  menu.append(new MenuItem({
    label: "Quit",
    click: () => exports.quit()
  }))

  menu.popup();
}

exports.openChangelog = () => {
  const https = require('https')
  const options = {
    hostname: 'rubish.netlify.app',
    port: 443,
    path: '/flawfull/changelog.txt',
    method: 'GET'
  }

  const req = https.request(options, res => {
    res.on('data', (data) => {
      if (res.statusCode == 200) {
        //creates a changelog modal and appends text from changelog.txt, containing all previous versions
        const changelogModal = modalSystem.createModal(`
          <h1>Changelog</h1>
          <hr />
          ${data}
        `)
      } else {
        modalSystem.createModal(`
          <h1>Changelog not found :(</h1>
        `);
      }
    })
  })

  req.on('error', error => {
    console.error(error);
    modalSystem.createModal(`
      <h1>Changelog not found :(</h1>
    `);
  })

  req.end();
}

//FEATURES

exports.openHistory = () => {
  const historyFile = dataSystem.getPath("history.json");
  const data = fileSystem.getFile(historyFile);
  let outputHTML = "";
  for (let i = data.length - 1; i >= 0; i--) {
    outputHTML += `<span class='history-element'>${data[i].date} | ${data[i].time} | <img src="${data[i].favicon}" /> 
    ${data[i].title} | <span class="link" flawfull-url="${data[i].url}">${data[i].url}</span></span><br />`;
  }

  function purge() {
    const purge = document.getElementById("purge");
    const elements = document.getElementsByClassName("history-element");
    purge.addEventListener("click", () => {
      // for (let i = 0; i < elements.length; i++) {
      //   setTimeout(() => {
      //     //work on this at some point
      //     elements[i].parentNode.removeChild(elements[i]);
      //   }, 200);
      // }
      exports.crash();
    })
  }
  
  modalSystem.createModal(`
    <h2>Search History | <button id="purge">Purge</button></h2>
    <hr>
    <!--<span class="warning">&#9888; Feature unavailable</span>-->
    ${outputHTML}
  `, purge)
}

exports.openBookmarks = () => {
  const bookmarkFile = dataSystem.getPath("bookmarks.json");
  const data = fileSystem.getFile(bookmarkFile);
  function initialize() {
    let x;
    for (let i = data.length - 1; i >= 0; i--) {
      x = document.getElementsByClassName("bookmark-element")[i].querySelector(".x");
      x.addEventListener("click", () => {
        console.log(x);
        console.log(x.parentNode);
        
        const bookmarksFile = dataSystem.getPath("bookmarks.json");
        fileSystem.removeObjBasedOnProperty(bookmarksFile, "url", x.parentNode.querySelector(".link").getAttribute("flawfull-url"));
        x.parentNode.parentNode.removeChild(x.parentNode);
      })
    }
  }
  let outputHTML = "";
  for (let i = data.length - 1; i >= 0; i--) {
    outputHTML += `<span class="bookmark-element"><img src="${data[i].favicon}" /> ${data[i].title} | 
    <span class="link" flawfull-url="${data[i].url}">${data[i].url}</span> | <img class="x" id="${data[i].url}" src="https://i.ibb.co/zHw126t/x.png" /></span><br/>`;
  }
  modalSystem.createModal(`
    <h2>Bookmarks | <span class="warning">Warning: very glitchy at the moment</h2>
    <hr>
    ${outputHTML}
  `, initialize);
}

//Do this later
// exports.openPasswords = () => {
//   let modal;
//   function passwording() {
//     const passwords = document.getElementById("passwords");
//     modal.addEventListener("keydown", (e) => {
//       if (e.which == 13) {
        
//       }
//     })
//   }
//   modal = modalSystem.createModal(`
//     <h2>Passwords</h2>
//     Put your passwords here and click enter for each password: <input id="passwords" />
//   `, passwording);
// }


//I have no idea what's going on here, so it's _best just to let it lie_
exports.setMusicVolume = () => {

  return; //until you can fix the youtube api external script error

  const music = document.getElementById("music-player");
  if (!music) {
    console.warn("No music player found");
    (async () => {
      await document.getElementById("music-player");
      console.log(document.getElementById("music-player"));
    })();
    console.log("out");
    return;
  }

  console.log("second! (hopefully)");

  console.log("Changing music...");

  music.setVolume(settingSystem.getSettings().musicVolume);

}

exports.setMusic = () => {

  return; //until you can fix the youtube api external script error


  console.log("first!");

  //add a thing that restarts the video if its time is at the end
  //add a thing where it sets a random point in the video


  const settings = settingSystem.getSettings();

  const previousVideo = document.getElementById("music-player");
  const previousSoundScript = document.getElementById("sound-script");

  if (previousVideo) {
    domSystem.removeElement(previousVideo);
    console.log("Removed previous video");
  }
  let url;

  switch (settings.backgroundMusic) {
    case "Focus":
      url = "https://www.youtube.com/embed/hGIW2fDb0jg";
      break;
    case "Smooth Ambient":
      url = "https://www.youtube.com/embed/VmDaHuVJ6z0";
      break;
    case "Studying":
      url = "https://www.youtube.com/embed/PNhQakLdI9o";
      break;
    default:
      //no background music
      break;
    }

    if (!url) return;

    const vidId = url.replace("https://www.youtube.com/embed/", "");

    const ytplayer = document.createElement("DIV");
    ytplayer.id = "music-player";
    ytplayer.style.display = "none";


    document.body.appendChild(ytplayer);

    console.log(document.getElementById("music-player"));

    window.onYouTubePlayerAPIReady = function() {
      onYouTubePlayer();
    };

    let player;

    function onYouTubePlayer() {
      player = new YT.Player('music-player', {
        height: '10',
        width: '10',
        videoId: vidId,
        playerVars: { controls:1, showinfo: 0, rel: 0, showsearch: 0, iv_load_policy: 3, loop: 1 },
        events: {
          // 'onStateChange': onPlayerStateChange,
          'onError': catchError,
          "onReady": onPlayerReady
        }
      });
    }

    function onPlayerReady(event) {
      const randomSecond = Math.floor(Math.random() * player.getDuration());
      player.seekTo(randomSecond, true);
      console.log(randomSecond);
      player.setVolume(50);
      //make it so that YOU CAN SET THE VOLUME IN SETTINGS, AND ADD SMALLER HEADINGS FOR SETTING BRANCHES (MUSIC, ETC);
      player.playVideo();
    }

    function catchError(event)
    {
      if(event.data == 100) console.log("De video bestaat niet meer");
    }
    function stopVideo() {
      player.stopVideo();
    }

}

exports.searchAllowed = () => {
  //checks if a there currently is a modal in existence, it not, then return true
  if (!modalSystem.checkModal()) {
    return true;
  }
  return false;
}

exports.openSettings = (mandatory = false) => {

  //I have no idea what's going on here, but I wrote it so it's probably right

  const settingModal = modalSystem.createModal(`
    <h2>Settings</h2>
    <hr>
    <h4 class="setting-title">Bugs</h4>
    <div class="input-container">
      <span class="setting">Bug Chance</span>
      <input id="bugChance" class="option-input show-value" type="range" step="5" min="0" max="100" value="0" />
      <span class="input-value percent">0%</span>
      <!--<span class="warning">&#9888; Feature unavailable</span>-->
    </div>
    <h4 class="setting-title">Background Music</h4>
    <div class="input-container unavailable">
      <span class="setting">Background Music</span>
      <select id="backgroundMusic" class="option-input">
        <option>None</option>
        <option>Smooth Ambient</option>
        <option>Focus</option>
        <option>Studying</option>
      </select>
      <span class="warning">&#9888; Feature unavailable</span>
    </div>
    <div class="input-container unavailable">
      <span class="setting">Music Volume</span>
      <input id="musicVolume" class="option-input show-value" type="range" step="5" min="0" max="50" value="50" />
      <!--do something so that whenever I submit settings it only registers things that have been changed-->
      <span class="input-value percent">50%</span>
      <span class="warning">&#9888; Feature unavailable</span>
    </div>
    <h4 class="setting-title">Search Engine</h4>
    <div class="input-container">
      <span class="setting">Search Engine</span>
      <select id="searchEngine" class="option-input">
        <option>None</option>
        <option>Google</option>
        <option>Bing</option>
        <option>Duck Duck Go</option>
      </select>
    </div>
    <br />
    <hr>
    <button class="submit">Submit</button>

    `, null, false, mandatory);

    const submitButton = settingModal.querySelector(".submit");
    if (!submitButton) {
      console.warn("No submit button in settings");
      return;
    }
    submitButton.addEventListener("click", () => dataSystem.submitSettings(submitButton));
    
    submitButton.addEventListener("click", () => exports.notification("New settings applied"))

    const modal = submitButton.parentNode.parentNode.parentNode;

    const modalContent = modal.querySelector(".modal-content");

    //updating values for elements who need value updating

    const showValueElements = modalContent.getElementsByClassName("show-value");

    const bugChance = document.getElementById("bugChance");
    
    bugChance.addEventListener("input", () => {
      if (bugChance.value > 90) {
        dataSystem.submitSettings(submitButton);
        modalSystem.createWarning("THIS MAY CAUSE UNWANTED RESULTS. ARE YOU SURE YOU WANT TO CONTINUE?");
      }
    });

    [...showValueElements].forEach((element) => {
        element.addEventListener("input", () => {
          domSystem.updateModalValue(element);
        });
    });

    const settings = settingSystem.getSettings();


    //gathering input:

    dataSystem.getSettings();
}

exports.openRequests = () => {
  modalSystem.createModal(`
      <h2>Request a Feature</h2>
      Contact <a class="link" href="mailto:flawfull.help@gmail.com">flawfull.help@gmail.com</a> to request a feature
  `);
}

exports.openFeedback = () => {
  const feedbackModal = modalSystem.createModal(`
      <h2>Report an Issue</h2>
      Contact <a class="link" href="mailto:flawfull.help@gmail.com">flawfull.help@gmail.com</a> to request a feature
  `);
  

  //screw that, just use email lol
  //fix this please, as it doesn't work
  // const feedbackModal = modalSystem.createModal(`
  //     <h2>Feedback</h2>
  //     <div class="input-container unavailable">
  //       <textarea id="feedbackDescription" class="text-input"></textarea>
  //       <span class="warning">&#9888; Feature unavailable</span>
  //     </div>
  //     <button disabled="true" class="submit disabled" onclick="dataSystem.submitFeedback(this)">Submit</button>
  // `);
}

// exports.openBugReport = () => {
//   //I just wasted 40 minutes of my life coding something that literally could have been solved in one line

//   //onclick submits bug through <dataSystem.submitBug(submitBugButton)>
//   function addClick() {
//     const submitBugButton = document.getElementById("submit-bug");
//     submitBugButton.addEventListener("click", () => dataSystem.submitBug(submitBugButton));
//   }

//   //opens bug report
//   const bugReportModal = modalSystem.createModal(`
//       <h2>Report a Bug</h2>
//       <div class="input-container unavailable">
//         <textarea id="bugDescription" class="text-input"></textarea>
//         <span class="warning">&#9888; Feature unavailable</span>
//       </div>
//       <div class="input-container unavailable">
//         <input id="bugScreenshot" type="file" class="file-input" multiple/>
//         <span class="warning">&#9888; Feature unavailable</span>
//       </div>
//       <button id="submit-bug" class="submit disabled">Submit</button>
//     `, addClick);
// }

exports.openAbout = () => {
  //opens about
  const aboutModal = modalSystem.createModal(`
    <h2>About</h2>
    <div class="modal-text">Flawfull, as its name suggests, is a rather flawed web browser with plenty of issues and unkown glitches. Apart from this, Flawfull allows you to browse the web with
    all its glory and pride, and provides many different search engine options. It was built by the one and only <span class="link" id="github" flawfull-url="https://github.com/avisk1">avisk1</span>,
    of the company Rubish&#169;. <b>Enjoy!</b><br /><br />You can visit the official Flawfull website <span class="link" flawfull-url="https://rubish.netlify.app/flawfull">here</span>.</div>
  `);
}

exports.openPrivacy = () => {
  //opens privacy
  const privacyModal = modalSystem.createModal(`
    <h2>Privacy</h2>
    <div class="modal-text">Flawfull does not collect or track any sort of user data</div>
  `);
  /*<div class="modal-text">Flawfull does not collect or track any sort of user data. Just kidding!
  Flawfull <del>tracks</del> <i>will</i> track virtually everything you do and <del>uploads</del> <i>will</i> upload all your data to an unsecure database. 😉</div>*/
}

//deprecated and pretty much useless
//the only reason I'm keeping is cause I feel like it's already being used...
exports.settingFunctions =  { "bugChance": bugSystem.removeBugs, "backgroundMusic": exports.setMusic(), "musicVolume": exports.setMusicVolume() };


exports.openLink = (link) => {
  //creates a new tab with a link attached
  if (link) {
    const tab = searchSystem.newTab(link);
  }
  modalSystem.closeAllModals();
}

exports.crash = () => {
  app.quit();
}

exports.quit = () => {
  const quitModal = modalSystem.createModal(`
    <h2>Are you sure you want to quit Flawfull?</h2>
    <button class="submit">Sure</button>
  `);
  const button = quitModal.querySelector(".submit");
  button.addEventListener("click", () => {
    console.log("CLICKED");
    //checks if there's a bug, if so -??
    if (bugSystem.getBug()) {
      console.log("Bug hehe >:D")
      modalSystem.closeModal(quitModal);
      exports.quit();
    } else {
      console.log("Quitting app...");
      if (bugSystem.getBug()) {
        exports.restart();
      } else {
        app.quit();
      }
    }
  })
}

exports.notification = (message) => {
  const element = document.createElement("div");
  element.id = "notification";
  element.innerHTML = message;
  function close() {
    element.style.bottom = "-34px";
    setTimeout(() => {
      element.parentNode.removeChild(element);
    }, 300);
  }
  element.addEventListener("click", () => {
    close();
  })

  document.getElementsByClassName("container-after-titlebar")[0].appendChild(element);

  setTimeout(() => {
    element.style.bottom = "0px";
  }, 100);
  
  setTimeout(() => {
    close();
  }, 5000)
}

exports.openUpdates = () => {
  //creates new modal with latest updates
  const updateModal = modalSystem.createModal(`
    <h2>Updates | v${app.getVersion()} (February 7, 2021)</h2>
    <hr />
    <ul>
      <li>Fixed modals not scrolling</li>
      <li>Created left panel</li>
      <li>Added search history</li>
      <li>Added reload shortcut</li>
      <li>Added notifications</li>
      <li>Fixed links opening in a new tab</li>
      <li>Added a context menu for tabs</li>
      <li><b>Added webview events (finally)</b></li>
      <li><b>Added a crappy bookmarking system</b></li>
      <li><b>Added open in new tab</b></li>
    </ul>
    <h2>Future Updates</h2>
    <hr />
    <ul>
      <li>Fix the crappy bookmarking system</li>
    </ul>
  `)
}
