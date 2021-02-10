const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const appF = require("./Functions/appSystem.js");
const searchSystem = require("./Functions/searchSystem.js");

// document.addEventListener("click", (e) => {
//   if (e.target.classList.contains("tab") || e.target.classList.contains("tab-title") || e.target.classList.contains("tab-image")) {
//     console.log("clicked a tab");
    
//   }
// })

let rightClickPosition;

//context menu
var menu = new Menu();

//copy
menu.append(new MenuItem({
  label: "Copy",
  click: () => {
    document.execCommand('copy');
  },
  accelerator: "Ctrl + C"
}))
//copy link

//the problem is that it's selecting the actual text, not the href :(
// menu.append(new MenuItem({
//   label: "Copy Link",
//   click: () => {
//     let element = document.elementFromPoint(rightClickPosition.x, rightClickPosition.y);
//     if (element.classList.contains("link") || element.tagName == "a") {
//       let range;
//       if (document.body.createTextRange) {
//         range = document.body.createTextRange();
//         range.moveToElementText(element);
//         range.select();
//       } else if (window.getSelection) {
//         const selection = window.getSelection();
//         range = document.createRange();
//         range.selectNodeContents(element);
//         selection.removeAllRanges();
//         selection.addRange(range);
//       }
//       document.execCommand('copy');
//       if (window.getSelection) {
//         window.getSelection().removeAllRanges();
//       }
//       else if (document.selection) {
//         document.selection.empty();
//       }

//     }
//   }
// }));
//cut
menu.append(new MenuItem({
  label: "Cut",
  click: () => {
    document.execCommand("cut")
  },
  accelerator: "Ctrl + X"
}))
//paste
menu.append(new MenuItem({
  label: "Paste",
  click: () => {
    document.execCommand("paste")
  },
  accelerator: "Ctrl + V"
}))
//undo
menu.append(new MenuItem({
  label: "Undo",
  role: "undo",
  accelerator: "Ctrl + Z"
}))
//redo
menu.append(new MenuItem({
  label: "Redo",
  role: "redo",
  accelerator: "Ctrl + Shift + Z"
}))
//inspect element
menu.append(new MenuItem({
    label: "Inspect Element",
    click: () => {
      remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y)
    }
}));

menu.append(new MenuItem({
  label: "Open In New Tab",
  click: () => {
    let element = document.elementFromPoint(rightClickPosition.x, rightClickPosition.y);
    if (element.classList.contains("link") || element.tagName == "a") {
      appF.openLink(element.getAttribute("flawfull-url"));
    }
  }
}));





Menu.setApplicationMenu(menu);


window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  rightClickPosition = {x: e.x, y: e.y};
  let element = document.elementFromPoint(rightClickPosition.x, rightClickPosition.y);
  if (e.target.classList.contains("tab") || e.target.classList.contains("tab-title") || e.target.classList.contains("tab-image") || e.target.classList.contains("tab-contents")) {
    //creates a new menu for tab context menus
    menu = new Menu();
    menu.append(new MenuItem({
      label: "Close",
      click: () => {
        for (let i = 0; i < 3; i++) {
          if (element.classList.contains("tab")) {
            break;
          } else {
            element = element.parentNode;
            if (i == 2) {
              console.error("Well there's supposed to be an element there but...there isn't. Weird");
              return;
            }
          }
        }
        searchSystem.close(element);
      }
    }));
    menu.append(new MenuItem({
      label: "Toggle Mute",
      click: () => {
        const view = searchSystem.getCorrespondingWebview(searchSystem.selectedTab());
        if (view.isAudioMuted()) {
          view.setAudioMuted(false);
        } else {
          view.setAudioMuted(true);
        }
      }
    }));
  }
  menu.popup(remote.getCurrentWindow());
}, false);
