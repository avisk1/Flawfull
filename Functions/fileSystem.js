const fs = require("fs");

exports.getFile = (file, parse = true) => {
  //reads the file using fs and if parse is true, parses it
  let data = fs.readFileSync(file, "utf8");
  if (parse) return JSON.parse(data);
  return data;
}

exports.setFileProperty = (file, key, value) => {
  //reads the data with parse = true
  let data = JSON.parse(fs.readFileSync(file, "utf8"));
  //changes the value for the local object
  data[key] = value;
  //replaces the original object with the new one
  fs.writeFileSync(file, JSON.stringify(data));
}

exports.appendText = (file, text) => {
  //just useless
  if (!fs.existsSync(file)) {
    fs.appendFileSync(file, "");
  }
  let data = fs.readFileSync(file, "utf8");
  data += "\n" + text;
  fs.writeFileSync(file, data);
}
