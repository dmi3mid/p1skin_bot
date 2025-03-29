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
async function promiseWriteFile(pathToFile, data) {
    try {
        await fsPromises.writeFile(pathToFile, data, "utf-8");
        console.log("File was rewrited");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    promiseReadFile,
    promiseWriteFile,
}