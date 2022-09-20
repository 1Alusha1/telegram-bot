import { Telegraf, Scenes, session } from 'telegraf';
import 'dotenv/config';

import Admin from './model/Admin.js';
import Student from './model/Student.js';

import main from './mongoConnect.js';

import SceneGenerator from './Scenes/SceneGenerator.js';
import createNewStudent from './use/createNewStudent.js';
import sendMessageToStudent from './use/sendMessageToStudent.js';

const chooseGroup = SceneGenerator.GenChooseGroup();
const createGroup = SceneGenerator.GenCreateGroup();
const setGroupTeacher = SceneGenerator.GenSetGroupTeacher();
const groupName = SceneGenerator.GenGroupName();
const teacherUsername = SceneGenerator.GenTeacherUsername();

const stage = new Scenes.Stage([
  chooseGroup,
  createGroup,
  setGroupTeacher,
  teacherUsername,
  groupName,
]);

// new Admin({
//   username: 'wwwtsch',
// }).save();

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
      return ctx.reply(`
      Привіт, ти викладач, за тобою закріпленна группа: ${admin.group}
      `);
    }
    if (student) {
      return ctx.reply('Цю комнду досить визвати один раз 🤍');
    }

    await createNewStudent(ctx);

    await ctx.reply(`
    Привіт! 👋🏻
Я — твій помічник у нагадуванні про інтерактиви 👩🏼‍💻
Не вимикай сповіщення, щоб нічого не пропустити, адже тут буде лише важлива інформація 🤍
    `);

    await ctx.scene.enter('chooseGroup');
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
});

bot.command('/createGroup', async (ctx) => {
  const username = ctx.message.from.username;
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return ctx.reply('Як ти дізнався про цю команду? 😳');
  }

  await ctx.scene.enter('createGroup');
});

bot.command('/setGroupTeacher', async (ctx) => {
  const username = ctx.message.from.username;
  const admin = await Admin.findOne({ username: username });

  if (!admin) {
    return ctx.reply('Як ти дізнався про цю команду? 😳');
  }

  await ctx.scene.enter('groupName');
});

bot.on('text', async (ctx) => {
  try {
    const username = ctx.message.from.username;
    const admin = await Admin.findOne({ username });

    if (admin) {
      sendMessageToStudent(ctx, admin.group);
    } else {
      ctx.reply(
        'Напиши своєму куратору 🤍'
      );
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
