// eslint-disable-next-line import/no-extraneous-dependencies
const useBabelRC = require('@cypress/code-coverage/use-babelrc');

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    // args.push('--use-fake-device-for-media-stream')
    // if (browser.name === 'chrome') {
    args.push('--use-fake-ui-for-media-stream');
    args.push('--use-fake-device-for-media-stream');
    // args.push(
    //   `--use-file-for-fake-video-capture=${path.join(
    //     // frontend\cypress\plugins
    //     __dirname,
    //     '..',
    //     'cypress/fixtures/Ishowspeed.y4m'
    //   )}`
    // );
    // }

    return args;
  });

  // Used to instrument code ran like unit tests
  on('file:preprocessor', useBabelRC);
};
