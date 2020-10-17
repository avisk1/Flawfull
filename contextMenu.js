const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const {ipcRenderer} = require('electron');

// console.log(ipcRenderer);


//whoops this actually isn't ONLY a contextMenu.js file, but I'm too lazy to change it, so that's what it's going to be called

let rightClickPosition;

var menu = new Menu();
const menuItem = new MenuItem(
  {
    label: 'Inspect Element',
    click: () => {
      remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y)
    }
  }, {
    label: "Test",
    click: () => {
      console.log("CLICKED");
    }
  }
)

menu.append(menuItem);
// menu.append(new MenuItem({ label: 'MenuItem1', click: function() { console.log('item 1 clicked'); } }));
// menu.append(new MenuItem({ type: 'separator' }));
// menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  rightClickPosition = {x: e.x, y: e.y};
  menu.popup(remote.getCurrentWindow());
}, false);

/*menu.append(new MenuItem({
  label: `${appF.config.name}`,
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
      label: "Quit",
      type: "normal",
      click: () => appF.quit()
    }
  ]

}));*/
