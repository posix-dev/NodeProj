const path = require('path');
const fs = require("fs");
const config = require("./config");
const {isDelete} = require("./config");

const sourceFolderName = config.sourceFolderName,
    targetFolderName = config.targetFolderName,
    rootFolderPath = config.rootFolderPath;

const startMovement = async () => {
    try {
        let files = fs.readdirSync(rootFolderPath)
        if (files && files.indexOf(sourceFolderName) > -1) {
            fs.mkdirSync(targetFolderName, {recursive: true});
            await recursiveSearch(sourceFolderName)
        } else if (files.indexOf(sourceFolderName) === -1) {
            console.log('Путь к исходной папке указан неверно');
            throw new Error('Путь к исходной папке указан неверно');
        }
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
};

const recursiveSearch = async (directoryName) => {
    let files = fs.readdirSync(directoryName);

    files.forEach(item => {
        let childPath = path.join(directoryName, item);
        let info = fs.statSync(childPath);

        if (info.isDirectory()) {
            recursiveSearch(childPath);
        } else {
            moveToTargetFolder(childPath);
        }
    })
};

const moveToTargetFolder = async (filePath) => {
    let subFolderName = path.basename(filePath)[0].toUpperCase();
    let files = fs.readdirSync(targetFolderName);
    let targetDirectory = path.join(targetFolderName, subFolderName);

    if (files.indexOf(subFolderName) === -1) {
        fs.mkdirSync(targetDirectory);
        await moveFile(filePath, targetDirectory);
    } else {
        await moveFile(filePath, targetDirectory);
    }
};

const moveFile = async (sourcePath, targetDirectory) => {
    let fileName = path.basename(sourcePath),
        readStream = fs.createReadStream(sourcePath),
        writeStream = fs.createWriteStream(path.join(targetDirectory, fileName));

    readStream.on('error', err => {
        throw new Error('readStream error')
    });
    writeStream.on('error', err => {
        throw new Error('writeStream error')
    });

    if (isDelete) {
        readStream.on('close', (err) => {
            if (err) throw Error('moveFile close error');

            fs.unlinkSync(sourcePath);
            deleteFolder();
        });
    }

    readStream.pipe(writeStream);
};

const deleteFolder = async (pathToDeleteFolder = sourceFolderName) => {
    let stats = fs.statSync(pathToDeleteFolder);
    let files;

    if (stats.isDirectory()) {
        files = fs.readdirSync(pathToDeleteFolder);
    }

    if (!files) return;

    if (files.length) {
        files.forEach(item => deleteFolder(path.join(pathToDeleteFolder, item)));
    } else {
        fs.rmdirSync(pathToDeleteFolder, {recursive: true});
        if (
            path.dirname(pathToDeleteFolder) === sourceFolderName
            && fs.readdirSync(sourceFolderName).length === 0
        )
            fs.rmdirSync(sourceFolderName);
        else
            await deleteFolder(path.dirname(pathToDeleteFolder));
    }
};

startMovement()
    .then(() => console.log('Everything is ok'))
    .catch(e => console.log(`Error: ${e.message} - ${e.code}`))


