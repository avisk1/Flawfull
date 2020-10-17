const settingSystem = require("./settingSystem.js");

exports.getBug = () => {
  //pretty self-explanatory
  const chance = Math.floor(Math.random() * 100) + 1; //number from 1 to 100
  if (chance <= settingSystem.getSettings().bugChance) {
    return true;
  }
  return false;
}
