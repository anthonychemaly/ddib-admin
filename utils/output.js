const fs = require("fs");

function writeJSONToFile(filePath, jsonData) {
  // Convert the JSON data to a string
  const jsonString = JSON.stringify(jsonData, null, 2);

  // Write the JSON string to a file
  fs.writeFile(filePath, jsonString, "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`JSON data has been written to ${filePath}`);
    }
  });
}

module.exports = {
  writeJSONToFile,
};
