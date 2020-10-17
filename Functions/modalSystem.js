// const modal = require("./Functions/modal.js");

const domSystem = require("./domSystem.js");
const modalSystem = require("./modalSystem.js");
const dataSystem = require("./dataSystem.js");
const fileSystem = require("./fileSystem.js");

exports.createModal = (content, functionCall, centered = false, mandatory = false) => {

  //add stuff here


  //modal
  const modal = document.createElement("DIV");
  modal.classList.add("modal");

  modal.mandatory = mandatory;

  document.body.appendChild(modal);

  //check if multiple modals

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




  if (functionCall) {
    functionCall();
  }



  //modal entrance
  requestAnimationFrame(() => {
    modalContent.style.transform = "scale(1, 1)";
  })

  return modal;

}

exports.closeModal = (modal) => {
  console.log("Closing a modal...");
  modal.style.display = "none";
  domSystem.removeElement(modal);
}

exports.checkModal = () => {
  if (document.getElementsByClassName("modal").length > 0) {
    return true;
  }
  return false;
}
