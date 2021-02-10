const fs = require("fs");

exports.getFile = (file, parse = true) => {
  //reads the file using fs and if parse is true, parses it
  let data = fs.readFileSync(file, "utf8");
  if (parse) return JSON.parse(data);
  return data;
}

exports.setFileProperty = (file, key, value) => {
  if (!fs.existsSync(file)) {
    fs.appendFileSync(file, "");
  }
  //reads the data with parse = true
  let data = JSON.parse(fs.readFileSync(file, "utf8"));
  //changes the value for the local object
  data[key] = value;
  //replaces the original object with the new one
  fs.writeFileSync(file, JSON.stringify(data));
}

exports.checkDuplicateObj = (file, input) => {
  const data = exports.getFile(file);
  let obj;
  for (let i = 0; i < data.length; i++) {
    obj = data[i];
    if (Object.keys(input).length != Object.keys(obj).length) continue;
    for (let i = 0; i < Object.keys(obj).length; i++) {
      if (Object.keys(obj)[i] != Object.keys(input)[i]) {
        break;
      }
      if (i == Object.keys(obj).length - 1) return true;
    }
  }
  return false;
}



//Doesn't work for some reason
// exports.removeObjFromArray = (file, obj) => {
//   const data = exports.getFile(file);
//   const index = data.indexOf(obj);
//   if (index > -1) {
//     data.splice(index, 1);
//     fs.writeFileSync(file, JSON.stringify(data));
//     return;
//   }
//   console.warn("Object not found:");
//   console.log(obj);
//   console.log(data);
// }

//this is just stupid
// exports.removeObjBasedOnURL = (file, obj) => {
//   let data = exports.getFile(file);
//   for (let i = 0; i < data.length; i++) {
//     if (data[i].url == obj.url) {
//       console.log("found the url");
//       data.splice(i, 1);
//       fs.writeFileSync(file, JSON.stringify(data));
//       return;
//     }
//   }
// }

//this is smart
exports.removeObjBasedOnProperty = (file, property, value) => {
  let data = exports.getFile(file);
  for (let i = 0; i < data.length; i++) {
    if (data[i][property] == value) {
      data.splice(i, 1);
      fs.writeFileSync(file, JSON.stringify(data));
      return;
    }
  }
}

//this is smart
exports.checkObjProperty = (file, property, value) => {
  let data = exports.getFile(file);
  for (let i = 0; i < data.length; i++) {
    if (data[i][property] == value) {
      return true;
    }
  }
  return false;
}

exports.appendText = (file, text) => {
  //just useless
  if (!fs.existsSync(file)) {
    fs.appendFileSync(file, "");
  }
  let data = fs.readFileSync(file, "utf8");
  data += text + "\n";
  fs.writeFileSync(file, data);
}

exports.initialize = (file, startingContent) => {
  if (!fs.existsSync(file)) {
    fs.appendFileSync(file, startingContent);
  }
}

exports.appendObj = (file, obj) => {
  let data = exports.getFile(file);
  data.push(obj);
  fs.writeFileSync(file, JSON.stringify(data));
}