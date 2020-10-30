const modalSystem = require("./modalSystem.js");
const dataSystem = require("./dataSystem.js");
const appF = require("./appSystem.js");
const settingSystem = require("./settingSystem.js");
const { app } = require("electron").remote;
const path = require("path");

exports.getPath = (file) => {
  //gets the path of a file and returns it
  const appData = app.getPath("userData");
  const thing_path = path.join(appData, file);
  return thing_path;
}

exports.getSettings = () => {
  //get root directory here and get the settings from that
    const settings = settingSystem.getSettings();
    console.log(settings);
    const settingsLength = Object.keys(settings).length;
    //I just have no idea
    for (let key in settings) {
      console.log(key);
      const element = document.getElementById(key);
      console.log(element);
      if (!element) {
          console.warn("Element not found (id from settings key)");
          continue;
      }

      element.value = settings[key];

      const inputValue = element.parentNode.querySelector(".input-value");
      let unit = "";
      if (inputValue) {
        console.log(inputValue.classList);
        if (inputValue.classList.contains("percent")) {
          unit = "%";
        }
        inputValue.innerHTML = settings[key] + unit;
      }
    }
}

exports.getData = (modal) => {
  //Don't make your own errors; JavaScript has enough of them!

  //Checks if the modal is a modal. Why..?
  if (!modal.classList.contains("modal")) {
    console.warn("Not a modal");
    return;
  }

  const modalContent = modal.querySelector(".modal-content")
  const modalContentChildren = modalContent.querySelector(".modal-content-inner").children;
  const inputContainers = [...modalContent.getElementsByClassName("input-container")];

  const inputList = [];

  //iterates through each inputContainer element
  inputContainers.forEach((container) => {
    //iterates through its children
    for (let i = 0; i < container.children.length; i++) {
      const element = container.children[i];
      //if it's some sort of general input element
      if (element.tagName.toLowerCase() === "input" || element.tagName.toLowerCase() === "textarea" || element.tagName.toLowerCase() === "select") {
        const obj = { };
        obj.id = element.id;
        //checks which type of input, and adds the value to obj based on the element's "value" property
        if (element.classList.contains("option-input")) {
          obj.value = element.value;
        } else if (element.classList.contains("file-input")) {
          obj.value = element.files;
        } else if (element.classList.contains("text-input")) {
          obj.value = element.value;
        } else {
          console.warn("Invalid input class");
          return;
        }
        //appends it to inputList
        inputList.push(obj);
      }
    }
  });

  return inputList;

}


//useless
exports.submitBug = (button) => {
  const modal = button.parentNode.parentNode.parentNode;
  const inputList = dataSystem.getData(modal);
  console.log(inputList);
}

//useless
exports.submitFeedback = (button) => {
  const modal = button.parentNode.parentNode.parentNode;
  const inputList = dataSystem.getData(modal);
  console.log(inputList);
}


exports.submitSettings = (button) => {
  const modal = button.parentNode.parentNode.parentNode;


  const modalContent = modal.querySelector(".modal-content");

  if (!modalContent) {
    console.warn("No modal content found");
    return;
  }

  //gets the data from the modal
  const inputList = dataSystem.getData(modal);

  //gets the settings before they've been changed
  const preSettings = settingSystem.getSettings();

  //iterates through inputList and sets each corresponding property in settings
  inputList.forEach((input) => {
    fileSystem.setFileProperty(settingSystem.getSettingsPath(), input.id, input.value);
  })

  //gets latest settings
  const settings = settingSystem.getSettings();

  //iterates through all of settings' keys
  for (let i = 0; i < Object.keys(settings).length; i++) {
    let keyName = Object.keys(settings)[i];
    //if the current setting was changed just now
    if (preSettings[keyName] !== settings[keyName]) {
      //Oh, so _that's_ what it's for
      if (appF.settingFunctions[keyName]) {
        appF.settingFunctions[keyName]();
      }
    }
  }

  modalSystem.closeModal(modal);

}
