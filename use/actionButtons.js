import Groups from '../model/Groups.js';
import MainGroup from '../model/MainGroup.js';
import { Markup } from 'telegraf';
import { drowButtons } from '../Scenes/chooseGroup.js';
import createNewStudent from '../use/createNewStudent.js';

async function createStudentInGroup(groupName, ctx) {
  try {
    const username = ctx.update.callback_query.from.first_name;
    const id = ctx.update.callback_query.from.id;
    Groups.findOneAndUpdate(
      { groupName },
      {
        $push: {
          students: { student: { username, id, group: groupName } },
        },
      },
      (err) => {
        console.log(err);
      }
    );
    await ctx.reply(`Ти приєднався(-лась) до групи ${groupName}`);
    await createNewStudent(ctx, groupName);
    await ctx.scene.leave();
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}

async function addStudentToGroup(subGroups, bot) {
  try {
    console.log(subGroups)
    if (subGroups.length) {
      subGroups.forEach((item) => {
        bot.action(item.groupName, async (ctx) => {
          await ctx.answerCbQuery();
          createStudentInGroup(item.groupName, ctx);
        });
      });
    } else {
      bot.action(subGroups, async (ctx) => {
        await ctx.answerCbQuery();
        createStudentInGroup(subGroups, ctx);
      });
    }
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}

export default function actionButton(array, bot) {
  try {
    array.forEach(async (item) => {
      bot.action(item.groupName, async (ctx) => {
        await ctx.answerCbQuery();
        const mainGroup = await MainGroup.findOne({
          groupName: item.groupName,
        });
        if (mainGroup.subGroup.length) {
          await ctx.replyWithHTML(
            '<b>Обери підгрупу:</b>',
            Markup.inlineKeyboard([drowButtons(mainGroup.subGroup)])
          );
          return addStudentToGroup(mainGroup.subGroup, bot);
        } else {
          createStudentInGroup(item.groupName, ctx);
        }
      });
    });
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}
