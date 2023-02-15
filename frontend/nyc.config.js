module.exports = {
  extension: ['.jsx', '.ts', '.tsx'], // List of extensions that nyc should attempt to handle in addition to .js
  // include: [
  //   './src/**/*.{js,jsx,ts,tsx}',
  //   '!./src/pages/room/[id].{js,jsx,ts,tsx}', // CYPRESS ONLY SHOULD BE CONCERNED WITH TESTING THIS PAGE.. TOO ADVANCED FOR JEST...
  //   '!./src/**/_*.{js,jsx,ts,tsx}',
  //   '!**/*.d.ts',
  //   '!**/node_modules/**',
  // ],
  branches: 75,
  lines: 75,
  functions: 80,
  statements: 80,
  'report-dir': 'cypress-coverage',
  all: false, // Whether or not to instrument all files (not just the ones touched by your test suite)
  sourceMap: true,
  instrument: true,
};
