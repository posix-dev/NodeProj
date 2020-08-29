const path = require('path');
const process = require('process');

module.exports = {
    sourceFolderName: 'source',
    targetFolderName: 'target',
    isDelete: process.argv[2] || false,
    rootFolderPath: path.join(__dirname)
}