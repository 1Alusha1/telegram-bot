import { Telegraf, Scenes, session } from 'telegraf';
import 'dotenv/config';

import Admin from './model/Admin.js';
import Student from './model/Student.js';

import main from './mongoConnect.js';

import {
  setGroupTeacher,
  setGroupName,
  setSubGroupName,
  setTeacherUsername,
} from './Scenes/setGroupTeacher.js';
import chooseGroup from './Scenes/chooseGroup.js';
import sendMessageToStudent from './use/sendMessageToStudent.js';

const stage = new Scenes.Stage([
  chooseGroup(),
  setGroupTeacher(),
  setTeacherUsername(),
  setGroupName(),
  setSubGroupName(),
]);
const bot = new Telegraf(process.env.BOT_TOKEN);

main().catch((err) => console.log(err));

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  try {
    const username = ctx.message.from.username;
    const userId = ctx.message.from.id;
    const admin = await Admin.findOne({ username: username });
    const student = await Student.findOne({ id: Number(userId) });

    if (admin) {
      if (admin.group.length && admin.subGroup.length) {
        return ctx.reply(`
  Привіт, ти викладач, за тобою закріпленна група: ${admin.group} під группа ${admin.subGroup}`);
      } else {
        return ctx.reply(`
          Привіт, ти викладач, за тобою закріпленна група: ${admin.group}
        `);
      }
    }
    if (student) {
      return ctx.reply('Цю комнду досить визвати один раз 🤍');
    }

    await ctx.reply(`
    Привіт! 👋🏻
Я — твій помічник у нагадуванні про вебінари та інші важливі події 👩🏼‍💻
Не вимикай сповіщення, щоб нічого не пропустити, адже тут буде лише важлива інформація 🤍
    `);

    ctx.scene.enter('chooseGroup');
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
});

bot.command('/setGroupTeacher', async (ctx) => {
  try {
    const username = ctx.message.from.username;
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      return ctx.reply('Як ти дізнався про цю команду? 😳');
    }
    if (admin.username !== process.env.MAIN_ADMIN) {
    return ctx.reply('Як ти дізнався про цю команду? 😳');
    }
    await ctx.scene.enter('setGroupTeacher');
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
});

bot.on('text', async (ctx) => {
  try {
    const username = ctx.message.from.username;
    const admin = await Admin.findOne({ username });

    if (admin) {
      sendMessageToStudent(ctx, admin);
    } else {
      ctx.reply('Напиши своєму куратору 🤍');
    }
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
