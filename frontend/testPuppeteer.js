/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const puppeteer = require('puppeteer');

const wait = (milliseconds) =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((r) => setTimeout(r, milliseconds));
// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
const { EventEmitter } = require('events');
const path = require('path');

const app = express();
const events = new EventEmitter();

app.get('/connect', async (req, res) => {
  events.emit('connect', req, res);
});
events.on('connect', async (req, res) => {
  const { url, message, kick, waitAfterSendingMessage, leave } = req.query;

  // TODO: Use getBrowser.js from https://github.com/BrycensRanch/Focus-SIS/blob/feat/classroom-integration/getBrowser.js
  const browser = await puppeteer.launch({
    args: [
      `--use-fake-device-for-media-stream`,
      `--use-fake-ui-for-media-stream`,
      `--no-sandbox`,
      `--use-file-for-fake-video-capture=${path.join(
        __dirname,
        'cypress/fixtures/akiyo_cif.y4m'
      )}`,
    ],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 1920, height: 1080 });
  console.log(`sending message: ${message}`);
  if (Array.isArray(message) && message.length && message !== 'undefined') {
    const promises = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const msg of message) {
      // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
      await page.type('#message', msg);
      // eslint-disable-next-line no-await-in-loop, no-restricted-syntax

      // eslint-disable-next-line no-await-in-loop
      await page.click('#messageSend');
    }
    await Promise.all(promises);
  } else if (message) {
    await page.type('#message', message);
    await page.click('#messageSend');
  }
  if (kick) {
    events.emit('kick', req, res, browser, page);
  }
  if (leave) {
    await wait(1000);
    await page.click('#leaveRoom');
  }
  if (waitAfterSendingMessage && !kick) {
    // not a bug, it's a feature!
    await res.send('ok');
    await wait(2500);
    await browser.close();
  } else {
    await res.send('ok');
    await browser.close();
  }
});
app.listen(8081, () => {});
events.on('kick', async (req, res, browser, page) => {
  await res.send('ok');
  await wait(1200);
  await page.click('#kickButton');
  await browser.close();
});
