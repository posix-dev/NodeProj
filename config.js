const path = require('path');
const process = require('process');
const DEFAULT_INTERVAL = 1000;
const DEFAULT_DELAY = 5000;
const DEFAULT_PORT = 3000;

module.exports = {
    sourceFolderName: 'source',
    targetFolderName: 'target',
    interval: process.argv[2] || DEFAULT_INTERVAL,
    duration: process.argv[3] || DEFAULT_DELAY,
    port: process.argv[4] || DEFAULT_PORT,
    rootFolderPath: path.join(__dirname)
};