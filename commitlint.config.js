const { lstatSync: fileInfo } = require("fs");
const {dirname: dirName, basename: baseName} = require("path")
var readDirectory = require('recursive-readdir-synchronous');

const DEFAULT_SCOPES = ["repo", "frontend", "backend", "commitlint"];

const dirNames = readDirectory("./frontend", ["node_modules"]).concat(readDirectory("./backend", ["node_modules"]))
  .filter((e) => !e.includes("node_modules")) // this is why every commit failed
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