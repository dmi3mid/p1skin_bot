const express = require('express');
const fsPromises = require('fs/promises');
const path = require('path');
require('dotenv').config();

const server = express();

const pathToFile = path.join(__dirname, 'voices.json');
async function promiseReadFile(pathToFile) {
    try {
        let content = await fsPromises.readFile(pathToFile, "utf-8");
        return content;
    } catch (error) {
        console.log(error);
        return null;
    }
}

server.get('/results', async (req, res) => {
    const content = await promiseReadFile(pathToFile);
    res.send(content);
    res.end().status(200);
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});