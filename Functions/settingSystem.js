const fileSystem = require("./fileSystem.js");

exports.defaultSettings = { "bugChance": 0, "backgroundMusic": "None", "musicVolume": 0, "searchEngine": "None", "justUpdated": "false" };

exports.getSettings = () => {
  const settings = fileSystem.getFile(exports.getSettingsPath());
  if (!settings) {
    console.warn(`${settings_path} not found`);
  } else {
    return settings;
  }
}
//gets the settings path
exports.getSettingsPath = () => {
  const { app } = require("electron").remote;
  const path = require("path");
  const appData = app.getPath("userData");
  const settings_path = path.join(appData, "settings.json");
  return settings_path;
}
