const domSystem = require("./domSystem.js");
const modalSystem = require("./modalSystem.js");
const dataSystem = require("./dataSystem.js");
const fileSystem = require("./fileSystem.js");

exports.createWarning = (message) => {
  function edits() {
    const modalContent = document.querySelector(".modal-content");
    modalContent.style.backgroundColor = "yellow";
    const modalContentInner = document.querySelector(".modal-content-inner");
    modalContentInner.style.color = "red";
    modalContentInner.style.fontWeight = "bold";
    modalContentInner.style.fontSize = "35px";
    modalContentInner.style.textAlign = "center";
    modalContentInner.innerHTML = modalContentInner.innerHTML + `
      <br />
      <button id="confirm">CONTINUE</button>
    `
    const confirm = document.getElementById("confirm");
    confirm.addEventListener("click", () => {
      exports.closeModal(modal);
    })
    const modal = document.querySelector(".modal");
    modal.style.backgroundColor = "red";
  }
  exports.createModal(message, edits, true, true);
}

exports.createModal = (content, functionCall, centered = false, mandatory = false) => {

  //modal
  const modal = document.createElement("DIV");
  modal.classList.add("modal");

  modal.mandatory = mandatory;

  document.body.appendChild(modal);

  //check if multiple modals, and closes them if there is

  const modalList = document.getElementsByClassName("modal");

  if (modalList.length === 2) {
    if (!modalList[0].mandatory) {
      modalSystem.closeModal(modalList[0]);
    } else {
      modalSystem.closeModal(modalList[1]);
      return;
    }
  }

  //modal content
  const modalContent = document.createElement("DIV");
  modalContent.classList.add("modal-content");
  // modalContent.style.transform = "scale(0, 0)";

  modal.appendChild(modalContent);

  if (!mandatory) {
    modal.addEventListener("click", (event) => {
      if (event.target !== modal) return;
      modalSystem.closeModal(modal);
    });
    //modal close button
    const modalClose = document.createElement("SPAN");
    modalClose.classList.add("modal-close");
    modalClose.innerHTML = "Nope";


    modalClose.addEventListener("click", (event) => {
      if (event.target !== modalClose) return;
      modalSystem.closeModal(modal);
    });
    modalContent.appendChild(modalClose);

  }

  modalContent.appendChild(domSystem.strToNode(content));


  //updating values for elements who need value updating
  [...modalContent.children].forEach((element) => {
    if (element.classList.contains("show-value")) {
      element.addEventListener("input", () => {
        domSystem.updateModalValue(element);
      });
    }
  });

  //checks if there's a function call that goes along with the modal
  if (functionCall) {
    functionCall();
  }

  //modal entrance (which is beautiful)
  requestAnimationFrame(() => {
    modalContent.style.transform = "scale(1, 1)";
  })

  //looks for any links in the modal content and if there is, adds a click listener to it
  const links = modalContent.getElementsByClassName("link");
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", () => {
      appF.openLink(links[i].getAttribute("flawfull-url"));
      exports.closeModal(modal);
    });
  }

  return modal;

}

exports.closeModal = (modal) => {
  console.log("Closing a modal...");
  //not necessary, but ok
  modal.style.display = "none";
  domSystem.removeElement(modal);
}

exports.checkModal = () => {
  //checks if there's at least one modal
  if (document.getElementsByClassName("modal").length > 0) {
    return true;
  }
  return false;
}

exports.closeAllModals = () => {
  const modals = document.getElementsByClassName("modal");
  for (let i = 0; i < modals.length; i++) {
    domSystem.removeElement(modals[i]);
  }
}