const Tg = require('node-telegram-bot-api');
require('dotenv').config();

const {getFetch} = require('./fetching.js');

const bot = new Tg(process.env.TOKEN, {polling: true});

bot.onText("/start", async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, "Привіт! Я бот для відправки голосових повідомлень");
});
bot.on("voice", async (msg) => {
    const chatId = msg.chat.id;
    const voiceId = msg?.voice?.file_id;
    await bot.sendMessage(chatId, `Voice id:\n<code>${voiceId}</code>`, { parse_mode: "HTML" });
});
bot.on("inline_query", async (query) => {
    const results = await getFetch();
    await bot.answerInlineQuery(query.id, results);
});