const walk = require('ignore-walk')

// All options are optional, defaults provided.

// to walk synchronously, do it this way:
const result = walk.sync({
  ignoreFiles: [ '.gitignore' ], // list of filenames. defaults to ['.ignore']
  includeEmpty: true, // true to include empty dirs, default false
})
console.log(result.map((r) => `--exclude '${r}'`).join(" "))