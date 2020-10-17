// const searchSystem = require("./Functions/searchSystem.js");
const { BrowserView, screen } = require("electron").remote;

const browserWindow = require("electron").remote.getCurrentWindow();

const { globalShortcut } = require("electron").remote;

const searchContainer = document.getElementsByClassName("search-container")[0];
const searchShape = searchContainer.getElementsByClassName("parallelogram")[0];
const searchBar = document.getElementById("search-bar");
const newTabIcon = document.getElementById("new-tab-icon");
const searchIcon = document.getElementById("search-icon");

searchBar.addEventListener("focus", () => {
  searchShape.style.WebkitBoxShadow = "0 0 8px black";
});

searchBar.addEventListener("focusout", () => {
  searchShape.style.WebkitBoxShadow = "0 0 4px black";
});



const { width, height } = screen.getPrimaryDisplay().workAreaSize;

//change to iframe



// const view = new BrowserView();
// view.id = "web-contents";
// browserWindow.setBrowserView(view);
// view.setBounds({ x: width / 2, y: height / 2, width: 300, height: 300 });

searchIcon.addEventListener("click", () => {
  searchSystem.search(searchBar.value);
});

// const test = globalShortcut.register("CommandOrControl+Shift+T", () => {
  // setTimeout(() => {
  //   alert("yo");
  // }, 3000);
// });
// console.log(test);

// globalShortcut.register("CommandOrControl+W", () => {
//   alert("CLICKED");
//   console.log("the freak?");
// })


// globalShortcut.register("CommandOrControl+W", () => {
//   alert("what the heck");
// })

// globalShortcut.register('W', () => {
//   fileSystem.appendText("textInput.txt", "w");
//   return;
// })
//
// globalShortcut.register("Shift+W", () => {
//   fileSystem.appendText("textInput.txt", "W")
// })
//
// globalShortcut.register("T", () => {
//   fileSystem.appendText("textInput.txt", "t");
// });
//
// globalShortcut.register("Shift+T", () => {
//   fileSystem.appendText("textInput.txt", "T");
// });




//TABS ↓↓↓
