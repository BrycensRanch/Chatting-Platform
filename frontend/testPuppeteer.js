const puppeteer = require('puppeteer');
const express = require('express');
const { EventEmitter } = require('events');
const path = require('path');

const app = express();
const events = new EventEmitter();

let socket;

app.get('/connect', async (req, res) => {
  events.emit('connect', req, res);
});
events.on('connect', async (req, res) => {
  const { url } = req.query;
  const { message } = req.query;
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
  await page.goto(url, { waitUntil: 'networkidle2' });
  // await page.setViewport({ width: 1920, height: 1080 });
  const wait = (milliseconds) =>
    // eslint-disable-next-line no-promise-executor-return
    new Promise((r) => setTimeout(r, milliseconds));
  await wait(10000);
  if (Array.isArray(message)) {
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
  } else {
    await page.type('#message', message);
    await page.click('#messageSend');
  }
  await res.send('ok');
  await browser.close();
});
app.listen(8081, () => {});
