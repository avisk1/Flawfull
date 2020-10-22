const domSystem = require("./domSystem.js");
const fileSystem = require("./fileSystem.js");
const browserWindow = require("electron").remote.getCurrentWindow();
const settingSystem = require("./settingSystem.js");

const remote = require("electron").remote;

//EVENT LISTENERS:

const domainList = [ "com", "org", "net", "ca", "edu", "io", "app" ];

const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("change", () => {
  //removes spell check if it detects a domain
  for (let i = 0; i < domainList.length; i++) {
    if (searchBar.value.includes(`.${domainList}`)) {
      searchBar.setAttribute("spellcheck", "false");
      break;
    }
  }
});

//selects all the text in the search bar on click
searchBar.addEventListener("click", () => {
  searchBar.select();
})

const searchShape = document.querySelector(".parallelogram");
const searchIcon = document.getElementById("search-icon");

searchBar.addEventListener("focus", () => {
  searchShape.style.WebkitBoxShadow = "0 0 8px black";
});

searchBar.addEventListener("focusout", () => {
  searchShape.style.WebkitBoxShadow = "0 0 4px black";
});

searchIcon.addEventListener("click", () => {
  exports.search(searchBar.value);
});


//enter listener for search bar
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

//will add more keyboard shortcuts later

const back = document.getElementById("back-button");
const forward = document.getElementById("forward-button");
const reload = document.getElementById("reload-button");

//reload
reload.addEventListener("click", () => {
  const tab = exports.selectedTab();
  const view = exports.getCorrespondingWebview(tab);
  view.reload();
  view.addEventListener("did-finish-load", () => {
    view.addEventListener("dom-ready", () => {
      exports.updateTabUrl(view.getURL(), view);
    })
  })
})

//go back
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

//go forward
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

exports.getDomainName = (url) => {
  //first actual comment yay
  //base url
  const baseUrl = "https://www.google.com/s2/favicons?domain_url=";
  let n;
  let domain;
  for (let i = 0; i < domainList.length; i++) {
    domain = "." + domainList[i];
    //gets the index of the domain (eg ".com")
    n = url.indexOf(domain) + domain.length;
    if (url[n] != "/") continue;
    //if it isn't not found, exit, else if i is the last element in domainList, return
    if (n != (domain.length + -1)) {
      break;
    } else if (i == domainList.length - 1) return baseUrl + "notFound";
  }
  //removes anything after the domain
  console.log(baseUrl + url);
  url = url.slice(0, n);
  //returns the baseUrl plus the new url
  return baseUrl + url;
}

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

//returns defaultUrl based on selected search engine
exports.getDefaultUrl = () => {
  const settings = settingSystem.getSettings();
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
  return defaultUrl;
}

exports.search = (query) => {

  const searchBar = document.getElementById("search-bar");
  const tab = exports.selectedTab();
  const view = exports.getCorrespondingWebview(tab);

  let domain = false;
  //iterates through domain list and checks to see if one is included in the query (checking if it's a url)
  for (let i = 0; i < domainList.length; i++) {
    if (query.includes(`.${domainList[i]}`)) {
      domain = true;
    }
  }

  //if it is a url
  if (domain) {
    //if it's not a full url add http to it
    if (!query.startsWith("http") && !query.startsWith("https")) {
      query = "http://" + query;
    }
    //removes spellcheck
    searchBar.setAttribute("spellcheck", "false");
  } else {
    //replaces spaces
    query = query.split(" ").join("%20");
    //replaces "+"s
    query = query.split("+").join("%2b");

    //turns on spellcheck
    searchBar.spellCheck = "true";

    //gets the default url
    const defaultUrl = exports.getDefaultUrl();

    if (defaultUrl == "None") return;
    //adds defaultUrl to query and saves it to query
    query = defaultUrl + query;
  }

  view.src = query;
  tab.url = query;
  console.log(query);
  exports.updateTabUrl(query, view);

}

//gets the selected tab by checking which tab's selected property is equal to true
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

//selects the given tab
exports.select = (tab) => {

  const searchBar = document.getElementById("search-bar");
  searchBar.value = tab.url;
  const view = exports.getCorrespondingWebview(tab);

  view.newTab = false;

  //Pretty sure this does literally nothing
  // view.addEventListener("dom-ready", () => {
  //   searchBar.value = view.getURL();
  // })

  const tabs = document.getElementsByClassName("tab");
  const webViews = document.getElementsByClassName("web-contents");

  //deselects all tabs and hides all webviews
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].selected = false;
    tabs[i].style.opacity = "0.6";
    tabs[i].style.boxShadow = "none";
    webViews[i].style.display = "none";
  }

  //displays the selected tab's view
  view.style.display = "flex";

  //selects the tab
  tab.selected = true;

  tab.style.opacity = "1";
  tab.style.boxShadow = "0 0 3px #000000";

}
//closes the given tab
exports.close = (tab) => {

  const wasSelected = tab.selected;

  const view = exports.getCorrespondingWebview(tab);

  //removes the corresponding webview along with the tab's container
  domSystem.removeElement(view);
  domSystem.removeElement(tab.parentNode);

  if (wasSelected) {
    //if the tab is selected and open, go to the previous tab and select that one
    const tabs = document.getElementsByClassName("tab");
    const selectedTab = tabs[tabs.length - 1];
    exports.select(selectedTab);
    searchBar.blur();
  }

  //update the tab width
  exports.updateTabWidth();

}

exports.updateTabUrl = (url, view) => {
  //updates the tab url and other nice stuff
  const tab = exports.selectedTab();
  const tabImage = tab.querySelector(".tab-image");
  //changes search bar and tab url
  searchBar.value = url;
  tab.url = url;
  view.addEventListener("dom-ready", () => {
    //changes the tab title
    const title = tab.parentNode.querySelector(".tab-title");
    title.innerHTML = view.getTitle();
    //sets the tooltip
    tab.setAttribute("title", title.innerHTML);
    //sets the tab image based off the url
    tabImage.src = exports.getDomainName(view.getURL());
  });
}

//opens a new tab with url defaulting to null
exports.newTab = (url = null) => {

  const searchBar = document.getElementById("search-bar");
  //focuses the search bar so the user doesn't have to click it
  searchBar.focus();
  //sets the placeholder
  searchBar.placeholder = "Search";

  const tabListContainer = document.getElementById("tab-list-container");

  //Why is this even here
  //What does it do
  for (let i = 0; i < tabListContainer.children.length; i++) {
    tabListContainer.children[i].style.marginRight = "5px";
  }

  const tabContainer = document.createElement("DIV");
  tabContainer.classList.add("tab-container");
  const webContainer = document.getElementById("web-container");

  const tab = document.createElement("DIV");

  //if there is a given url, set tab.url to it
  if (url) {
    tab.url = url;
  } else {
    tab.url = "";
  }

  //initializes close button
  const close = document.createElement("SPAN");
  close.classList.add("tab-close");
  close.innerHTML = "&#10005;";

  //initializes tab title
  const title = document.createElement("SPAN");
  title.innerHTML = "New Tab";
  title.classList.add("tab-title");

  //initializes tab image
  const tabImage = document.createElement("IMG");
  tabImage.classList.add("tab-image");
  tabImage.src = "./icons/hexagon24.png";

  //initializes tab contents, which will hold the tab image and title
  const tabContents = document.createElement("DIV");
  tabContents.classList.add("tab-contents");

  //sets the tooltip
  tab.setAttribute("title", title.innerHTML);

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

  //if the user clicks the title instead of the tab, select the tab (pretty sure this is useless)
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

  //closes the tab once the user clicks the close button
  close.addEventListener("click", () => {
    if (tabListContainer.children.length > 1 + 1) {
      exports.close(tab);
    }
  });

  tab.classList.add("tab");

  //appending stuff!
  tabContents.appendChild(tabImage);
  tabContents.appendChild(title);

  tabContainer.appendChild(tab);

  tab.appendChild(tabContents);
  tabContainer.appendChild(close);

  tabListContainer.appendChild(tabContainer);

  //this is where it gets messy

 const view = document.createElement("WEBVIEW");

 view.preload = "./contextMenu.js";

 view.addEventListener("did-navigate-in-page", (event) => {
   view.addEventListener("did-finish-load", () => {
     view.addEventListener("dom-ready", () => {
       exports.updateTabUrl(view.getURL(), view);
     })
   })
 });

 view.addEventListener('did-start-loading', () => {
    remote.webContents.fromId(view.getWebContentsId()).setIgnoreMenuShortcuts(true);
});

//how nice would it be if this worked?
//instead it makes too many tabs

view.newTab = false;
 // 
 // view.addEventListener("dom-ready", () => {
 //   remote.webContents.fromId(view.getWebContentsId()).on('before-input-event', (event, input) => {
 //     if (input.type !== 'keyDown') {
 //       return;
 //     }
 //
 //   		/*code: input.code,
 //   		key: input.key,
 //   		shiftKey: input.shift,
 //   		altKey: input.alt,
 //   		ctrlKey: input.control,
 //   		metaKey: input.meta,
 //   		repeat: input.isAutoRepeat*/
 //
 //     if (input.key === "t" && input.control && !view.newTab) {
 //       view.newTab = true;
 //       exports.newTab();
 //     } else if (input.key === "w" && input.control && !)
 //   });
 // })

//on navigation update url
 view.addEventListener("did-navigate", (event) => {
   view.addEventListener("did-finish-load", () => {
     view.addEventListener("dom-ready", () => {
       exports.updateTabUrl(view.getURL(), view);
     })
   })
 });

  //if the load fails, alert the error description
   view.addEventListener("did-fail-load", (event) => {
     console.error(event.errorDescription);
     alert(event.errorDescription);
   })

  view.classList.add("web-contents");

  webContainer.appendChild(view);

  //automatically selects this tab
  exports.select(tab);

  let newTabIcon = document.getElementById("new-tab-icon");

  //if there isn't a new tab icon, create one and assign it an event listener
  if (!newTabIcon) {
    newTabIcon = document.createElement("DIV");
    newTabIcon.id = "new-tab-icon";
    newTabIcon.innerHTML = "&plus;";

    newTabIcon.addEventListener("click", () => {
      searchSystem.newTab();
    })
    tabListContainer.appendChild(newTabIcon);
  } else {
    //else, remove it and readd it which ensures that it will always be after all the tabs
    domSystem.removeElement(newTabIcon);

    tabListContainer.appendChild(newTabIcon);
  }

  //updates tab width
  exports.updateTabWidth(tab);

  tab.style.width = "100%";
  title.style.width = "100%";

  //if there is a url, search it
  if (url) {
    exports.search(url);
  }

  return tab;
}

//updates the tab width
exports.updateTabWidth = (tab) => {
  const tabListLength = document.getElementsByClassName("tab").length;
  const tabContainerList = document.getElementsByClassName("tab-container");

  //scales the tab width to the amount of current tabs
  let tabWidth;
  if (tabListLength >= 10) {
    tabWidth = (100) / tabListLength;
  } else {
    tabWidth = 15;
  }

  const contentWidth = tabWidth * 70 / 100;

  //sets the tabWidth and contentWidth
  for (let i = 0 ; i < tabContainerList.length; i++) tabContainerList[i].style.width = tabWidth.toString() + "%";
  const tabContents = document.getElementsByClassName("tab-contents");
  for (let i = 0; i < tabContents.length; i++) tabContents[i].style.width = contentWidth.toString() + "%";
}
