const { lstatSync: fileInfo } = require("fs");
const {dirname: dirName, basename: baseName} = require("path")
var readDirectory = require("recursive-readdir");

const DEFAULT_SCOPES = ["repo", "frontend", "backend"];

Promise.all([readDirectory("./frontend"), readDirectory("./backend")]).then((values) => {

const dirNames = values[0].concat(values[1])
  .map((e) => dirName(e))
  .map( (entry) => {
    const newEntry = fileInfo(entry)
    newEntry.name = baseName(entry)
    return newEntry;
  })
  .map((dir) => dir.name);

const scopes = [...new Set(DEFAULT_SCOPES.concat(dirNames).filter((s) => s !== "src"))];

module.exports = {
  extends: ["@commitlint/config-conventional", "monorepo"],
  rules: {
    "scope-enum": [2, "always", scopes],
  },
};
})