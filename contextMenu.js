const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

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
