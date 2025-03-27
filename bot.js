const Tg = require('node-telegram-bot-api');
require('dotenv').config();

const voices = require('./voices');

const bot = new Tg(process.env.TOKEN, {polling: true});

bot.on("inline_query", async (query) => {
    const queryText = query.query.trim().toLowerCase();
    
    let results = [
        {
            type: "voice",
            id: queryText,
            title: `Voice ${queryText}`,
            voice_file_id: voices[queryText],
        }
    ];

    if (!voices[queryText]) {
        console.log(`⚠️ Не знайдено голос для запиту: "${queryText}"`);
        return;
    }

    await bot.answerInlineQuery(query.id, results);
});