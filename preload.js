const ipcRenderer = require('electron').ipcRenderer;



//CONTEXT MENU

const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

let rightClickPosition;

//context menu
var menu = new Menu();

//outdated fix please soon
document.addEventListener("DOMContentLoaded", function () {
  var data = {
    "title": document.title,
    "url": window.location.href,
    "favicon": "https://www.google.com/s2/favicons?domain=" + window.location.href
  };

  ipcRenderer.send("window-data", data);

  // document.body.addEventListener("keydown", (event) => {
  //   alert(Object.keys(event).length);
  //   alert(Object.keys(event).toString());
    
  // })

  document.body.addEventListener("keydown", (e) => {
    //logging "e"s keys length is 1, yet ctrlKey and which still work smh
    const dumb = { keyCode: e.which, ctrlKey: e.ctrlKey };  
    ipcRenderer.send("keyboard-event-confirmed", dumb);
  })

  document.body.addEventListener("click", (e) => {
    var target = e.target;
    const data = { href: target.href, target: target.target, src: target.src };
    ipcRenderer.send("click-event-confirmed", data);
  })
  

  menu.append(new MenuItem({
    label: "Open In New Tab",
    click: () => {
      try {
      let element = document.elementFromPoint(rightClickPosition.x, rightClickPosition.y);
      // alert(element.innerHTML);
      //when checking if it has an href, check back 3 parentNodes and check if either of those have an href too
      for (let i = 0; i < 4; i++) {
        if (element.href) {
          // appF.openLink(element.getAttribute("flawfull-url"));
          ipcRenderer.send("new-tab-request-confirmed", element.href);
          break;
          // alert("YESSSS HECK YES");
        }
        element = element.parentNode;
      }
      
    } catch (err) {
      //they most likely didn't click a link
    }
    }
  }));
  
});

// ipcRenderer.on("window-data-reply", (event, arg) => {
//     menu.popup(remote.getCurrentWindow());
// })




//copy
menu.append(new MenuItem({
  label: "Copy",
  click: () => {
    document.execCommand('copy');
  },
  accelerator: "Ctrl + C"
}))
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

Menu.setApplicationMenu(menu);


window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  rightClickPosition = {x: e.x, y: e.y};
  menu.popup(remote.getCurrentWindow());
}, false);
