const path = require('path');
const fs = require("fs");
const config = require("./config");
const {isDelete} = require("./config");

const sourceFolderName = config.sourceFolderName,
    targetFolderName = config.targetFolderName,
    rootFolderPath = config.rootFolderPath;

fs.readdir(rootFolderPath, (err, files) => {
    if (err || files.indexOf(sourceFolderName) === -1) {
        console.log('Путь к исходной папке указан неверно');
        return
    }

    //create target folder and search in source folder
    fs.mkdir(targetFolderName, {recursive: true}, err => {
        if (err) return;

        recursiveSearch(sourceFolderName);
    })
});

const recursiveSearch = function (directoryName) {
    fs.readdir(directoryName, (err, files) => {
        if (err) return;

        files.forEach(item => {
            let childPath = path.join(directoryName, item);

            fs.stat(childPath, (err, stats) => {
                if (err) return;

                if (stats.isDirectory()) {
                    recursiveSearch(childPath);
                } else {
                    moveToTargetFolder(childPath);
                }
            })
        })
    })
};

const moveToTargetFolder = function (filePath) {
    let subFolderName = path.basename(filePath)[0].toUpperCase();

    fs.readdir(targetFolderName, (err, files) => {
        if (err) return;

        let targetDirectory = path.join(targetFolderName, subFolderName);
        if (files.indexOf(subFolderName) === -1) {
            fs.mkdir(targetDirectory, err => {
                if (err) return;
                moveFile(filePath, targetDirectory);
            });
        } else {
            moveFile(filePath, targetDirectory);
        }

    })
};

function moveFile(sourcePath, targetDirectory) {
    let fileName = path.basename(sourcePath),
        readStream = fs.createReadStream(sourcePath),
        writeStream = fs.createWriteStream(path.join(targetDirectory, fileName));

    readStream.on('error', err => {
    });
    writeStream.on('error', err => {
    });

    if (isDelete) {
        readStream.on('close', (err) => {
            if (err) return;

            fs.unlink(sourcePath, err => {
                if (err) return;

                deleteFolder();
            });
        });
    }

    readStream.pipe(writeStream);
}


const deleteFolder = function (pathToDeleteFolder = sourceFolderName) {
    fs.readdir(pathToDeleteFolder, (err, files) => {
        if (err) return;

        if (files.length) {
            files.forEach(item => deleteFolder(path.join(pathToDeleteFolder, item)));
        } else {
            fs.stat(pathToDeleteFolder, (err, stats) => {
                if (err || !stats.isDirectory()) return;

                fs.rmdir(pathToDeleteFolder, err => {
                    if (err) return;

                    if (path.dirname(pathToDeleteFolder) === sourceFolderName) {
                        fs.rmdir(sourceFolderName, err => {
                        })
                    } else {
                        deleteFolder(path.dirname(pathToDeleteFolder))
                    }
                })
            })
        }
    })
};


