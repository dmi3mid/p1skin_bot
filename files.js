const fsPromises = require('fs/promises');

async function promiseReadFile(pathToFile) {
    try {
        let content = await fsPromises.readFile(pathToFile, "utf-8");
        return content;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    promiseReadFile
}