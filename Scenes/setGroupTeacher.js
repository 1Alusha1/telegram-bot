import { Scenes, Markup } from 'telegraf';
import setAdminSubGroup from '../use/setAdminSubGroup.js';
import setAdminGroup from '../use/setAdminGroup.js';
import setName from '../use/setName.js';

const GenSetGroupTeacherState = {
  groupName: '',
  teacherUsername: '',
  subGroupName: '',
  subGroup: false,
  action: '',
};

export function setGroupTeacher() {
  try {
    const setGroupTeacher = new Scenes.BaseScene('setGroupTeacher');

    setGroupTeacher.enter(async (ctx) => {
      const buttons = [
        Markup.button.callback('Додати у підгрупу', 'subgroup'),
        Markup.button.callback('Додати у группу', 'group'),
      ];
      await ctx.replyWithHTML(
        '<b>Можливі дії</b>',
        Markup.inlineKeyboard([buttons])
      );
    });

    setGroupTeacher.action('group', async (ctx) => {
      GenSetGroupTeacherState.action = 'group';
      ctx.scene.enter('setGroupName');
    });
    setGroupTeacher.action('subgroup', async (ctx) => {
      GenSetGroupTeacherState.subGroup = true;
      GenSetGroupTeacherState.action = 'subgroup';
      return await ctx.scene.enter('setGroupName');
    });

    return setGroupTeacher;
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}

export function setGroupName() {
  try {
    const setGroupName = new Scenes.BaseScene('setGroupName');
    setGroupName.enter(async (ctx) => {
      await ctx.reply(
        'Введіть назву групи в якій потрібно створити  Викладача'
      );
    });
    setName(setGroupName, GenSetGroupTeacherState);

    return setGroupName;
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}

export function setSubGroupName() {
  try {
    const setSubGroupName = new Scenes.BaseScene('setSubGroupName');
    setSubGroupName.enter(async (ctx) => {
      await ctx.reply('Введіть назву підгруппи в яку потріно додати Викладача');
    });
    setName(setSubGroupName, GenSetGroupTeacherState);
    return setSubGroupName;
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}

export function setTeacherUsername() {
  try {
    const teacherUsername = new Scenes.BaseScene('setTeacherUsername');

    teacherUsername.enter(async (ctx) => {
      await ctx.reply(`Введіть username з телеграму викладача `);
    });

    teacherUsername.on('text', async (ctx) => {
      GenSetGroupTeacherState.teacherUsername = String(ctx.message.text);

      if (GenSetGroupTeacherState.teacherUsername) {
        await ctx.reply(
          `Вы обрали Выкладача ${GenSetGroupTeacherState.teacherUsername}`
        );

        (await GenSetGroupTeacherState.subGroup)
          ? await setAdminSubGroup(ctx, GenSetGroupTeacherState)
          : await setAdminGroup(ctx, GenSetGroupTeacherState);
        await ctx.scene.leave();
      }
    });
    return teacherUsername;
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}
