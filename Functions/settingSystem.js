const fileSystem = require("./fileSystem.js");

exports.defaultSettings = { "bugChance": 0, "backgroundMusic": "None", "musicVolume": 0, "searchEngine": "None", "justUpdated": "false" };

exports.getSettings = () => {
  const { app } = require("electron").remote;
  const path = require("path");
  const appData = app.getPath('userData');
  const settings_path = path.join(appData, "settings.json");
  const settings = fileSystem.getFile(settings_path);
  if (!settings) {
    console.warn(`${settings_path} not found`);
  } else {
    return settings;
  }
}

//CHANGE THIS INTO dataSystem.getPath("settings.json") once Flawfull has stabilized
exports.getSettingsPath = () => {
  const { app } = require("electron").remote;
  const path = require("path");
  const appData = app.getPath("userData");
  const settings_path = path.join(appData, "settings.json");
  return settings_path;
}
