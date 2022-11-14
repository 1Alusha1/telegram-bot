import Groups from '../model/Groups.js';
import MainGroup from '../model/MainGroup.js';
import Student from '../model/Student.js';

import message from '../message.js';
import drowButtons from './drowButtons.js';

export default function connectToGroup(array, bot) {
  array.forEach(async (item) => {
    bot.action(item.groupName, async (ctx) => {
      try {
        await ctx.answerCbQuery();
        const mainGroup = await MainGroup.findOne({
          groupName: item.groupName,
        });
        if (mainGroup.subGroup.length) {
          await drowButtons(mainGroup.subGroup, 'Обери групу: ', ctx);
          return addStudentToGroup(mainGroup.subGroup, bot);
        } else {
          createStudentInGroup(item.groupName, ctx);
        }
      } catch (err) {
        if (err) console.log(err);
        ctx.reply(message().error);
      }
    });
  });
}

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
    await ctx.reply(message().connectToGroup);

    new Student({
      id: ctx.update.callback_query.from.id,
      username: ctx.update.callback_query.from.first_name,
      group: groupName,
    }).save();

    await ctx.scene.leave();
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(message().error);
  }
}

async function addStudentToGroup(subGroups, bot) {
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
}
