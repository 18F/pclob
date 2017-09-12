const fs = require('fs');
const os = require('os');
const path = require('path');
const express = require('express');
const yaml = require('js-yaml');

const app = express();

const ROOT_DIR = path.normalize(path.join(__dirname, '..'));
const JEKYLL_CONFIG = yaml.safeLoad(fs.readFileSync(path.join(
  ROOT_DIR, '_config.yml')
));
const BASE_URL_PATH = JEKYLL_CONFIG.baseurl;
const SITE_PATH = path.normalize(path.join(ROOT_DIR, '_site'));

if (fs.existsSync(SITE_PATH)) {
  app.use(BASE_URL_PATH, express.static(SITE_PATH));
} else {
  console.log(`Please build the site before running me.`);
  process.exit(1);
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    const server = app.listen(() => {
      const hostname = os.hostname().toLowerCase();
      const port = server.address().port;
      resolve({
        hostname,
        port,
        url: `http://${hostname}:${port}`,
        httpServer: server,
      });
    });
  });
};

Object.assign(module.exports, { BASE_URL_PATH });
