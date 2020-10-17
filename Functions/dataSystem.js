const modalSystem = require("./modalSystem.js");
const dataSystem = require("./dataSystem.js");
const appF = require("./appSystem.js");
const settingSystem = require("./settingSystem.js");
const { app } = require("electron").remote;
const path = require("path");

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'flawfull.help@gmail.com',
//     pass: ''
//   }
// });
//
// const mailOptions = {
//   from: 'flawfull.help@gmail.com',
//   to: 'myfriend@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };
//
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

exports.getPath = (file) => {
  const appData = app.getPath("userData");
  const path = path.join(appData, file);
  return path;
}

exports.getSettings = () => {
  //get root directory here and get the settings from that
    const settings = settingSystem.getSettings();
    const settingsLength = Object.keys(settings).length;

    console.log(settings);

    for (const key in settings) {
      const element = document.getElementById(key);
      if (!element) {
          console.warn("Element not found (id from settings key)");
          return;
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

  if (!modal.classList.contains("modal")) {
    console.warn("Not a modal");
    return;
  }

  const modalContent = modal.querySelector(".modal-content")
  const modalContentChildren = modalContent.querySelector(".modal-content-inner").children;
  const inputContainers = [...modalContent.getElementsByClassName("input-container")];

  const inputList = [];

  inputContainers.forEach((container) => {
    for (let i = 0; i < container.children.length; i++) {
      const element = container.children[i];
      if (element.tagName.toLowerCase() === "input" || element.tagName.toLowerCase() === "textarea" || element.tagName.toLowerCase() === "select") {
        const obj = { };
        obj.id = element.id;
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
        inputList.push(obj);
      }
    }
  });

  return inputList;

}



exports.submitBug = (button) => {
  const modal = button.parentNode.parentNode.parentNode;
  const inputList = dataSystem.getData(modal);
  console.log(inputList);
}

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


  const inputList = dataSystem.getData(modal);

  const preSettings = settingSystem.getSettings();


  // const inputContainers = [...button.parentNode.getElementsByClassName("input-container")];
  inputList.forEach((input) => {
    fileSystem.setFileProperty(settingSystem.getSettingsPath(), input.id, input.value);
  })


  const settings = settingSystem.getSettings();

  for (let i = 0; i < Object.keys(settings).length; i++) {
    let keyName = Object.keys(settings)[i];
    if (preSettings[keyName] !== settings[keyName]) {
      console.log(preSettings[keyName]);
      console.log(settings[keyName]);
      console.log(keyName);
      if (appF.settingFunctions[keyName]) {
        appF.settingFunctions[keyName];
        console.log(appF.settingFunctions[keyName]);
      }
    }
  }


  modalSystem.closeModal(modal);

  //immediate setting changes:

  // appF.setMusic(preSettings);



}
