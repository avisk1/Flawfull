const domSystem = require("./domSystem.js");
const fileSystem = require("./fileSystem.js");
const browserWindow = require("electron").remote.getCurrentWindow();
const settingSystem = require("./settingSystem.js");




//EVENT LISTENERS:

const domainList = [ "com", "org", "net", "ca", "edu" ];

const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("change", () => {
  for (let i = 0; i < domainList.length; i++) {
    if (searchBar.value.includes(`.${domainList}`)) {
      searchBar.setAttribute("spellcheck", "false");
      break;
    }
  }
});

searchBar.addEventListener("click", () => {
  searchBar.select();
})

let previousChar = '';

document.body.addEventListener("keypress", (e) => {
  const input = e.which;
  switch(input) {
    case 13: { //enter
      if (document.activeElement.id == 'search-bar') {
        exports.search(document.activeElement.value);
      }
    }
  }
});

//CTRL T

document.body.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.which == 84 && appF.searchAllowed()) {
    exports.newTab();
  }
})

//CTRL W

document.body.addEventListener("keydown", (e) => {
  const tabs = document.getElementsByClassName("tab");
  if (e.ctrlKey && e.which == 87 && appF.searchAllowed() && tabs.length > 1) {
    exports.close(exports.selectedTab());
  }
})

const back = document.getElementById("back-button");
const forward = document.getElementById("forward-button");

back.addEventListener("click", () => {
  const tab = exports.selectedTab();
  const view = exports.getCorrespondingWebview(tab);
  view.goBack();
  view.addEventListener("did-finish-load", () => {
    view.addEventListener("dom-ready", () => {
      exports.updateTabUrl(view.getURL(), view);
    })
  })
});

forward.addEventListener("click", () => {
  const tab = exports.selectedTab();
  const view = exports.getCorrespondingWebview(tab);
  view.goForward();
  view.addEventListener("did-finish-load", () => {
    view.addEventListener("dom-ready", () => {
      exports.updateTabUrl(view.getURL(), view);
    })
  })
})



// const { browserWindow } = require("electron").remote;

exports.getCorrespondingWebview = (tab) => {
  const tabs = document.getElementsByClassName("tab");
  const webviews = document.getElementsByClassName("web-contents");
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i] === tab) {
      if (!webviews[i]) {
        console.warn("Webview cannot be found. Weird :/");
      }
      return webviews[i];
    }
  }
}


exports.search = (query) => {

  const searchBar = document.getElementById("search-bar");
  const tab = exports.selectedTab();
  const settings = settingSystem.getSettings();
  const view = exports.getCorrespondingWebview(tab);

  let domain = false;
  for (let i = 0; i < domainList.length; i++) {
    if (query.includes(`.${domainList[i]}`)) {
      domain = true;
    }
  }

  if (domain) {
    if (!query.startsWith("http")) {
      query = "http://" + query;
    }
    // view.src = query;
    console.log(view);
    searchBar.setAttribute("spellcheck", "false");



  } else {
    query = query.split(" ").join("%20");

    searchBar.spellCheck = "true";

    let defaultUrl;

    switch (settings.searchEngine) {
      case "Google":
        defaultUrl = "https://www.google.com/search?q=";
        break;
      case "Duck Duck Go":
        defaultUrl = "https://duckduckgo.com/?q=";
        break;
      case "Bing":
        defaultUrl = "https://www.bing.com/search?q=";
        break;
      case "None":
        defaultUrl = "None";
        break;
    }

    if (defaultUrl == "None") return;
    query = defaultUrl + query;


    // domSystem.checkIfLoaded(exports.getCorrespondingWebview(tab));
    // view.src = tab.url;
  }

  view.src = query;
  tab.url = query;
  console.log(query);
  exports.updateTabUrl(query, view);

  // const tabTitle = tab.parentNode.querySelector(".tab-title");
  // view.addEventListener("dom-ready", () => {
  //   tabTitle.innerHTML = view.getTitle();
  // });
  //
  // searchBar.value = view.src;
  // tabTitle.innerHTML = exports.webviewOnLoad(view, view.getTitle);

}

exports.selectedTab = () => {
  const tabs = document.getElementsByClassName("tab");
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].selected) {
      return tabs[i];
    }
  }
  console.warn("No selected tab");
  return null;
}

exports.select = (tab) => {

  const searchBar = document.getElementById("search-bar");
  searchBar.value = tab.url;
  const view = exports.getCorrespondingWebview(tab);
  view.addEventListener("dom-ready", () => {
    searchBar.value = view.getURL();
  })



  const tabs = document.getElementsByClassName("tab");
  const webViews = document.getElementsByClassName("web-contents");

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].selected = false;
    tabs[i].style.opacity = "0.6";
    tabs[i].style.boxShadow = "none";
    webViews[i].style.display = "none";
  }



  view.style.display = "flex";



  tab.selected = true;

  tab.style.opacity = "1";
  tab.style.boxShadow = "0 0 3px #000000";

}

// exports.webviewOnLoad = (view, func) => {
//   view.addEventListener("dom-ready", function(){
//     return func();
//   });
// }


exports.close = (tab) => {



  const wasSelected = tab.selected;

  const view = exports.getCorrespondingWebview(tab);
  domSystem.removeElement(view);

  domSystem.removeElement(tab.parentNode);




  if (wasSelected) {
    //if the tab is selected and open
    const tabs = document.getElementsByClassName("tab");
    const selectedTab = tabs[tabs.length - 1];
    exports.select(selectedTab);
    searchBar.blur();
  }

}

exports.updateTabUrl = (url, view) => {
  const tab = exports.selectedTab();
  searchBar.value = url;
  tab.url = url;
  view.addEventListener("dom-ready", () => {
    tab.parentNode.querySelector(".tab-title").innerHTML = view.getTitle();
  })
}

exports.newTab = (url = null) => {

  const searchBar = document.getElementById("search-bar");
  searchBar.focus();
  searchBar.placeholder = "Search";

  console.log("New tab!");

  const tabListContainer = document.getElementById("tab-list-container");

  for (let i = 0; i < tabListContainer.children.length; i++) {
    tabListContainer.children[i].style.marginRight = "5px";
  }

  const tabContainer = document.createElement("DIV");
  const webContainer = document.getElementById("web-container");

  const tab = document.createElement("DIV");

  if (url) {
    // tab.url = url;
    tab.url = url;
  } else {
    tab.url = "";
  }

  const close = document.createElement("SPAN");
  close.classList.add("tab-close");
  close.innerHTML = "&#10005;";

  const title = document.createElement("SPAN");
  title.innerHTML = "New Tab";
  title.classList.add("tab-title");


  //close button becomes visible once the tab is hovered over
  tab.addEventListener("mouseover", () => {
    close.style.visibility = "visible";
  });

  //close button becomes invisible once the cursor moves past the tab
  tab.addEventListener("mouseout", () => {
    close.style.visibility = "hidden";
  });

  //close button becomes visible once the tab is hovered over
  title.addEventListener("mouseover", () => {
    close.style.visibility = "visible";
  });

  //close button becomes invisible once the cursor moves past the tab
  title.addEventListener("mouseout", () => {
    close.style.visibility = "hidden";
  });

  //the tab becomes selected on click
  tab.addEventListener("click", () => {
    exports.select(tab);
  });

  title.addEventListener("click", () => {
    exports.select(tab);
  });



  //close button's background appears once the cursor hovers over the close button
  close.addEventListener("mouseover", () => {
    close.style.visibility = "visible";
    close.style.backgroundColor = "grey";
  });

  //close button's background becomes invisible once the cursor leaves it
  close.addEventListener("mouseout", () => {
    close.style.visibility = "hidden";
    close.style.backgroundColor = "transparent";
  });



  close.addEventListener("click", () => {
    if (tabListContainer.children.length > 1 + 1) {
      exports.close(tab);
    }
  });


  tab.classList.add("tab");

  tabContainer.appendChild(tab);
  tab.appendChild(title);
  // tabContainer.appendChild(title);
  tabContainer.appendChild(close);



  tabListContainer.appendChild(tabContainer);

 //  tab.html = `<div class="search-container">
 //     <div class="parallelogram">
 //         <input id="search-bar" />
 //         <span id="search-icon"></span>
 //     </div>
 // </div>`;

 const view = document.createElement("WEBVIEW");

 view.preload = "./contextMenu.js";

 view.addEventListener("did-navigate-in-page", (event) => {
   view.addEventListener("did-finish-load", () => {
     view.addEventListener("dom-ready", () => {
       exports.updateTabUrl(view.getURL(), view);
     })
   })
 });

 view.addEventListener("did-navigate", (event) => {
   view.addEventListener("did-finish-load", () => {
     view.addEventListener("dom-ready", () => {
       exports.updateTabUrl(view.getURL(), view);
     })
   })
 });

 view.addEventListener("did-fail-load", (event) => {
   console.error(event.errorDescription);
   // const error = document.createElement("DIV");
   // error.classList.add("error");
   // webContainer.appendChild(error);
 })

 view.classList.add("web-contents");


  // const view = document.createElement("WEBVIEW");
  // view.classList.add("web-contents");
  // view.src = tab.url;
  // view.autosize = "on";
  //
  // view.addEventListener("load", () => {
  //   // if (view.src != view.previousUrl) {
  //   //   view.previousUrl = view.src;
  //   // }
  //   console.log("loaded");
  //   const searchBar = document.getElementById("search-bar");
  //   if (tab.url) {
  //     searchBar.placeholder = view.src;
  //     searchBar.value = "";
  //   } else {
  //     searchBar.placeholder = "Search query here";
  //   }
  // })

  webContainer.appendChild(view);

  exports.select(tab);


  let searchScript = document.getElementById("search-script");
  if (!searchScript) {
    searchScript = document.createElement("SCRIPT");
    searchScript.id = "search-script";
    searchScript.src = "./search.js";
    document.body.appendChild(searchScript);
  }

  console.log("New tab");

  let newTabIcon = document.getElementById("new-tab-icon");

  if (!newTabIcon) {
    newTabIcon = document.createElement("DIV");
    newTabIcon.id = "new-tab-icon";
    newTabIcon.innerHTML = "&plus;";

    newTabIcon.addEventListener("click", () => {
      searchSystem.newTab();
    })


    tabListContainer.appendChild(newTabIcon);
  } else {
    domSystem.removeElement(newTabIcon);

    tabListContainer.appendChild(newTabIcon);
  }

  const tabListLength = tabListContainer.length;

  let tabWidth;
  if (tabListLength >= 10) {
    tabWidth = (100) / tabListLength;
  } else {
    tabWidth = 15;
  }

  const titleWidth = tabWidth * 90 / 100;

  tabContainer.style.width = tabWidth.toString() + "%";
  const tabTitles = document.getElementsByClassName("tab-title");
  for (let i = 0; i < tabTitles.length; i++) tabTitles[i].style.width = titleWidth.toString() + "%";

  tab.style.width = "100%";

  if (url) {
    exports.search(url);
  }




  return tab;
}
