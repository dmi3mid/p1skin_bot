const path = require('path');
const Tg = require('node-telegram-bot-api');
require('dotenv').config();
const { promiseReadFile, promiseWriteFile } = require('./files.js');

const bot = new Tg(process.env.TOKEN_PISKIN, {polling: true});
const pathToVoices = path.join(__dirname, "voices.json");
const users = {};
function setStep(chatId, step) {
    if (!users[chatId]) users[chatId] = {};
    users[chatId].step = step;
};
bot.onText("/start", async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, "Hello! This is a bot for sending funny voice messages. Just tag the bot, and you'll get a list of voice messages.");
});
bot.onText("/voice", async (msg) => {
    const userId = msg?.from?.id;
    if (userId !== Number(process.env.ADMIN_ID)) {
        await bot.sendMessage(userId, "This command is only available to the bot admin!");
        return;
    }
    const chatId = msg?.chat?.id;
    await bot.sendMessage(chatId, 'Send me a voice message.');
    setStep(chatId, 'ASK_VOICE');
});

bot.on("message", async (msg) => {
    const chatId = msg?.chat?.id;
    const voiceId = msg?.voice?.file_id;
    const text = msg?.text;

    if (!users[chatId] || !users[chatId].step) return;

    switch (users[chatId].step) {
        case 'ASK_VOICE':
            if(!msg.voice) {
                await bot.sendMessage(chatId, 'This is not a voice message!');
                delete users[chatId];
                return;
            }
            users[chatId].voice_file_id = voiceId;
            await bot.sendMessage(chatId, `Please enter the name of the voice message.`);
            setStep(chatId, 'ASK_TITLE');
            break;

        case 'ASK_TITLE':
            users[chatId].title = text.trim().toLowerCase();
            await bot.sendMessage(chatId, "Done! Now I'm saving your voice message!");
            await bot.sendMessage(chatId, `${users[chatId].title}:\n<pre><code>${users[chatId].voice_file_id}</code></pre>`, { parse_mode: "HTML" });
            const results = JSON.parse(await promiseReadFile(pathToVoices));
            const lastId = Number(results.length);
            results.push({
                type: "voice",
                id: String(lastId + 1),
                title: users[chatId]?.title,
                voice_file_id: users[chatId]?.voice_file_id,
            });
            await promiseWriteFile(pathToVoices, JSON.stringify(results));
            delete users[chatId];
            break;
    }
});

bot.on("inline_query", async (query) => {
    const results = JSON.parse(await promiseReadFile(pathToVoices));
    try {
        await bot.answerInlineQuery(query.id, results, { cache_time: 1 });
    } catch (error) {
        console.log(error.message);
    }   
});