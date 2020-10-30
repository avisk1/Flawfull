const settingSystem = require("./settingSystem.js");

exports.getBug = () => {
  //pretty self-explanatory
  const chance = Math.floor(Math.random() * 100) + 1; //number from 1 to 100
  if (chance <= settingSystem.getSettings().bugChance) {
    return true;
  }
  return false;
}

exports.removeBugs = () => {
  //checks if bug chance is set to 0
  const bugChance = settingSystem.getSettings().bugChance;
  if (bugChance == 0) {
    //if so, remove all currently active bugs:
    const searchBar = document.getElementById("search-bar");
    searchBar.parentNode.style.top = "0px";
  }
}
