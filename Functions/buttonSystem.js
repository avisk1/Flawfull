const dataSystem = require("./dataSystem.js");

//yeah this is absolutely useless
//don't delete it though, cause I'm pretty sure it's being required...somewhere...
exports.submit = (button) => {
  const modal = button.parentNode.parentNode.parentNode;
  dataSystem.submitData(modal);
}
