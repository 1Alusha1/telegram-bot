import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import 'dotenv/config';
import obcjectToArray from './objectToArray.js';

const bot = new Telegraf(process.env.BOT_TOKEN);
const adminId = process.env.ADMIN;

const addStudent = async (userId, ctx) => {
  await fetch(`${process.env.DB_URL}.json`, {
    method: 'post',
    mode: 'cors',
    body: JSON.stringify({
      userId,
      username: ctx.message.from.first_name,
    }),
  });
};

const remove = async (student) => {
  await fetch(`${process.env.DB_URL}/${student[0].id}/.json`, {
    method: 'delete',
    mode: 'cors',
  });
};

bot.start(async (ctx) => {
  try {
    const userId = ctx.message.from.id;

    const res = await fetch(`${process.env.DB_URL}.json`, {
      mode: 'cors',
    });

    const data = res.json();

    data.then(async (data) => {
      const user = obcjectToArray(data).filter(
        (student) => student.userId == userId
      );
      if (!user.length) {
        addStudent(userId, ctx);

        await ctx.reply(`
Привіт! 👋🏻
          
Я — твій помічник у нагадуванні про вебінари/інтерактиви 👩🏼‍💻
          
Не вимикай сповіщення, щоб нічого не пропустити, адже тут буде лише важлива інформація 🤍`);
      } else {
        await ctx.reply(`Цю комнду досить визвати один раз 🤍 `);
      }
    });
  } catch (err) {
    if (err) console.log(err);
  }
});

bot.on('text', async (ctx) => {
  try {
    const userId = ctx.message.from.id;

    const res = await fetch(`${process.env.DB_URL}.json`, {
      mode: 'cors',
    });

    const data = res.json();

    data.then((data) => {
      if (userId == adminId) {
        obcjectToArray(data).forEach((student) => {
          let userId = student.userId;

          ctx.telegram
            .sendMessage(String(userId), ctx.message.text)
            .catch((e) => {
              let student = obcjectToArray(data).filter(
                (student) => student.userId == Number(e.on.payload.chat_id)
              );
              remove(student);
            });
        });
      } else {
        ctx.reply(`
На жаль, я не можу відповісти тобі на запитання, проте куратор це зробить із задоволенням, напиши Насті 🤍
            `);
      }
    });
  } catch (err) {
    if (err) console.log(err);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
