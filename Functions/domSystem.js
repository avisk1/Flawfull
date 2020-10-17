exports.strToNode = (str) => {
  if (str.includes("<script")) {
    console.warn("Don't be an idiot and remove that script!");
  }
  const content = document.createElement("DIV");
  content.classList.add("modal-content-inner");
  content.innerHTML = str;
  return content;
}

exports.updateModalValue = (element) => {
  if (element.tagName.toLowerCase() !== "input") {
    console.warn("Not an input element");
    return;
  }
  try {
    const textValue = element.parentNode.getElementsByClassName("input-value")[0];
    textValue.innerHTML = element.value + "%";
  } catch (err) {
    console.warn("Can't find \"input-value\"");
    return;
  }

}

// exports.checkIfLoaded = (element) => {
//   if (element.readyState === "complete") {
//     alert("loaded!");
//     return;
//   }
//   console.log(element);
//   setTimeout(exports.checkIfLoaded(element), 100);
// }

exports.removeElement = (element) => {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  } else {
    console.warn("Element has no parent. ???");
  }
}



// exports.textEditor = (submitOption = true) => {
//   const contents = {};
//   contents.html = `
//
//   `
//   return contents;
// }
