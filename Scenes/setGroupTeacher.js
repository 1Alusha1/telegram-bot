import { Scenes, Markup } from 'telegraf';
import setAdminSubGroup from '../use/setAdminSubGroup.js';
import setAdminGroup from '../use/setAdminGroup.js';

import message from '../message.js';

const state = {
  groupName: '',
  teacherUsername: '',
  subGroupName: '',
  subGroup: false,
  action: '',
};

export function setGroupTeacher() {
  const setGroupTeacher = new Scenes.BaseScene('setGroupTeacher');
  setGroupTeacher.enter(async (ctx) => {
    try {
      const buttons = [
        Markup.button.callback('Додати у підгрупу', 'subgroup'),
        Markup.button.callback('Додати у групу', 'group'),
      ];
      await ctx.replyWithHTML(
        '<b>Можливі дії</b>',
        Markup.inlineKeyboard([buttons])
      );
    } catch (err) {
      if (err) console.log(err);
      ctx.reply(message().error);
    }
  });

  setGroupTeacher.action('group', async (ctx) => {
    state.action = 'group';
    ctx.scene.enter('setGroupName');
  });
  setGroupTeacher.action('subgroup', async (ctx) => {
    state.subGroup = true;
    state.action = 'subgroup';
    return await ctx.scene.enter('setGroupName');
  });

  return setGroupTeacher;
}

export function setGroupName() {
  const setGroupName = new Scenes.BaseScene('setGroupName');
  setGroupName.enter(async (ctx) => {
    try {
      await ctx.reply(message().enterNameNewGroup);
      setName(setGroupName, state);
    } catch (err) {
      if (err) console.log(err);
      ctx.reply(message().error);
    }
  });

  return setGroupName;
}

export function setSubGroupName() {
  const setSubGroupName = new Scenes.BaseScene('setSubGroupName');
  setSubGroupName.enter(async (ctx) => {
    try {
      await ctx.reply(message().enterNameNewSubGroup);
      setName(setSubGroupName, state);
    } catch (err) {
      if (err) console.log(err);
      ctx.reply(message().error);
    }
  });
  return setSubGroupName;
}

export function setTeacherUsername() {
  const teacherUsername = new Scenes.BaseScene('setTeacherUsername');

  teacherUsername.enter(async (ctx) => {
    await ctx.reply(message().enterUsernameTeacher);
  });

  teacherUsername.on('text', async (ctx) => {
    try {
      state.teacherUsername = String(ctx.message.text);

      if (state.teacherUsername) {
        await ctx.reply(message(state.teacherUsername).teacherChoosed);

        (await state.subGroup)
          ? await setAdminSubGroup(ctx, state)
          : await setAdminGroup(ctx, state);
        await ctx.scene.leave();
      }
    } catch (err) {
      if (err) console.log(err);
      ctx.reply(message().error);
    }
  });
  return teacherUsername;
}

function setName(scene, state) {
  scene.on('text', async (ctx) => {
    try {
      if (state.action === 'subgroup' && state.subGroup) {
        state.groupName = String(ctx.message.text);
        await ctx.reply(message(String(ctx.message.text)).groupChoosed);
        await ctx.scene.enter('setSubGroupName');
        state.subGroup = false;
      } else if (state.action === 'subgroup' && !state.subGroup) {
        state.subGroupName = String(ctx.message.text);
        await ctx.reply(message(String(ctx.message.text)).subGroupChoosed);
        await ctx.scene.enter('setTeacherUsername');
        state.subGroup = true;
      } else if (state.action === 'group' && !state.subGroup) {
        state.groupName = String(ctx.message.text);
        await ctx.reply(message(String(ctx.message.text)).groupChoosed);
        await ctx.scene.enter('setTeacherUsername');
      }
    } catch (err) {
      if (err) console.log(err);
      ctx.reply(message().error);
    }
  });
}
