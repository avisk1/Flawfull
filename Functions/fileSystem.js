const fs = require("fs");

exports.getFile = (file, parse = true) => {
  let data = fs.readFileSync(file, "utf8");
  if (parse) return JSON.parse(data);
  return data;
}

exports.setFileProperty = (file, key, value) => {
  let data = JSON.parse(fs.readFileSync(file, "utf8"));
  data[key] = value;
  fs.writeFileSync(file, JSON.stringify(data));
}

exports.appendText = (file, text) => {
  if (!fs.existsSync(file)) {
    fs.appendFileSync(file, "");
  }
  let data = fs.readFileSync(file, "utf8");
  data += "\n" + text;
  fs.writeFileSync(file, data);
}
