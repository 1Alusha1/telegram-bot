import { Telegraf, Scenes, session, Markup } from 'telegraf';
import 'dotenv/config';

import Admin from './model/Admin.js';
import Student from './model/Student.js';
import Groups from './model/Groups.js';

import main from './mongoConnect.js';
import axios from 'axios';
import randomInt from './use/randomInt.js';

import {
  setGroupTeacher,
  setGroupName,
  setSubGroupName,
  setTeacherUsername,
} from './Scenes/setGroupTeacher.js';
import { createAdminOwnGroup } from './Scenes/createAdminOwnGroup.js';
import { sendMessageToOwnGroup } from './Scenes/sendMessageToOwnGroup.js';
import chooseGroup from './Scenes/chooseGroup.js';

import sendMessageToStudent from './use/sendMessageToStudent.js';
import writeIntoOwnGroup from './hears/writeIntoOwnGroup.js';

import message from './message.js';

const stage = new Scenes.Stage([
  chooseGroup(),
  setGroupTeacher(),
  setTeacherUsername(),
  setGroupName(),
  setSubGroupName(),
  createAdminOwnGroup(),
  sendMessageToOwnGroup(),
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
        return ctx.reply(message(admin.group, admin.subGroup).adminSubGroup);
      } else {
        return ctx.reply(message(admin.group).adminGroup);
      }
    }
    if (student) {
      return ctx.reply(message().stop);
    }

    await ctx.reply(message().start);

    ctx.scene.enter('chooseGroup');
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(message().error);
  }
});

bot.command('/admin', async (ctx) => {
  const username = ctx.message.from.username;

  const admin = await Admin.findOne({ username: username });
  if (!admin) {
    return ctx.reply(message().incorrectUser);
  }

  try {
    if (admin.username !== process.env.MAIN_ADMIN) {
      await ctx.reply(
        'Доступні команди',
        Markup.keyboard([['Написати у групу', 'Увійти']])
          .oneTime()
          .resize()
      );
    } else {
      await ctx.reply(
        'Доступні команди',
        Markup.keyboard([
          ['Створити групу адміна', 'Створити власну підгрупу'],
          ['Написати у групу', 'Увійти'],
        ])
          .oneTime()
          .resize()
      );
    }
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(message().error);
  }
});

bot.hears('Створити групу адміна', async (ctx) => {
  await ctx.scene.enter('setGroupTeacher');
});

bot.hears('Написати у групу', async (ctx) => {
  writeIntoOwnGroup(bot, ctx);
});

bot.hears('Створити власну підгрупу', async (ctx) => {
  ctx.scene.enter('createAdminOwnGroup');
});

bot.hears('Увійти', async (ctx) => {
  const username = ctx.message.from.username;
  const admin = await Admin.findOne({ username });
  let code = randomInt(5);

  if (!admin) {
    return ctx.reply('У вас немає доступу до цієї команди!');
  }

  try {
    const res = await axios(`${process.env.API_URI}/auth/get-token`, {
      method: 'post',
      mode: 'no-cors',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({ _id: admin._id, username: admin.username, code }),
    });
    ctx.reply(message(code, res.data.message).authInfo);
  } catch (err) {
    if (err) console.log(err);
  }
});

bot.on('text', async (ctx) => {
  try {
    const username = ctx.message.from.username;
    const admin = await Admin.findOne({ username });

    if (admin) {
      const groups = await Groups.findOne({
        groupName: admin.subGroup.length ? admin.subGroup : admin.group,
      });

      if (groups.admin) {
        writeIntoOwnGroup(bot, ctx);
      } else {
        sendMessageToStudent(ctx, groups);
        await ctx.reply(message().messageSentIntoMainGroup);
      }
    } else {
      ctx.reply(message().writeYourTeacher);
    }
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(message().error);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
