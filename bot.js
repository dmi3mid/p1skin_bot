const path = require('path');
const Tg = require('node-telegram-bot-api');
require('dotenv').config();

const { promiseReadFile } = require('./files.js');

const bot = new Tg(process.env.TOKEN, {polling: true});

bot.onText("/start", async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, "Привіт! Я бот для відправки голосових повідомлень");
});
const pathToVoices = path.join(__dirname, "voices.json");
bot.on("inline_query", async (query) => {
    const results = await promiseReadFile(pathToVoices);
    await bot.answerInlineQuery(query.id, results);
});
bot.on("voice", async (msg) => {
    const chatId = msg.chat.id;
    const voiceId = msg?.voice?.file_id;
    await bot.sendMessage(chatId, `Voice id:\n<code>${voiceId}</code>`, { parse_mode: "HTML" });
});