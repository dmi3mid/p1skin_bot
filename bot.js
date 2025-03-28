const path = require('path');
const Tg = require('node-telegram-bot-api');
require('dotenv').config();

const { promiseReadFile } = require('./files.js');

const bot = new Tg(process.env.TOKEN, {polling: true});

const users = {};
function setStep(chatId, step) {
    if (!users[chatId]) users[chatId] = {};
    users[chatId].step = step;
};

bot.onText("/voice", async (msg) => {
    const userId = msg?.from?.id;
    if (userId !== Number(process.env.ADMIN_ID)) {
        await bot.sendMessage(userId, "Ця команда доступна тільки адміністратору бота!");
        return;
    }
    const chatId = msg?.chat?.id;
    await bot.sendMessage(chatId, 'Відправ мені голосове повідомлення!');
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
                await bot.sendMessage(chatId, 'Це не голосове повідомлення');
                delete users[chatId];
                return;
            }
            users[chatId].voice_file_id = voiceId;
            await bot.sendMessage(chatId, `Введіть назву голосового повідомлення`);
            setStep(chatId, 'ASK_TITLE');
            break;

        case 'ASK_TITLE':
            users[chatId].title = text.trim().toLowerCase();
            await bot.sendMessage(chatId, "Готово! Тепер я зберігаю ваше голосове повідомлення");
            await bot.sendMessage(chatId, `${users[chatId].title}:\n<pre><code>${users[chatId].voice_file_id}</code></pre>`, { parse_mode: "HTML" });
            delete users[chatId];
            break;
    }
});


bot.onText("/start", async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, "Привіт! Я бот для відправки голосових повідомлень");
});
const pathToVoices = path.join(__dirname, "voices.json");
bot.on("inline_query", async (query) => {
    const results = JSON.parse(await promiseReadFile(pathToVoices));
    await bot.answerInlineQuery(query.id, results);
});
// bot.on("voice", async (msg) => {
//     const chatId = msg.chat.id;
//     const voiceId = msg?.voice?.file_id;
//     await bot.sendMessage(chatId, `Voice id:\n<pre><code>${voiceId}</code></pre>`, { parse_mode: "HTML" });
// });