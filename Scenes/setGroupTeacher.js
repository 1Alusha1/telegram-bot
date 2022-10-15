import { Scenes, Markup } from 'telegraf';
import Admin from '../model/Admin.js';
import Group from '../model/Group.js';

const GenSetGroupTeacherState = {
  groupName: '',
  teacherUsername: '',
  subGroupName: '',
  subGroup: false,
  action: '',
};

export function setGroupTeacher() {
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
}

function setName(scene, state) {
  scene.on('text', async (ctx) => {
    if (state.action === 'subgroup' && state.subGroup) {
      state.groupName = String(ctx.message.text);
      await ctx.reply(`Вы обрали группу ${String(ctx.message.text)}`);
      await ctx.scene.enter('setSubGroupName');
      state.subGroup = false;
    } else if (state.action === 'subgroup' && !state.subGroup) {
      state.subGroupName = String(ctx.message.text);
      await ctx.reply(`Вы обрали підгруппу ${String(ctx.message.text)}`);
      await ctx.scene.enter('setTeacherUsername');
      state.subGroup = true;
    } else if (state.action === 'group' && !state.subGroup) {
      state.groupName = String(ctx.message.text);
      await ctx.reply(`Вы обрали группу ${String(ctx.message.text)}`);
      await ctx.scene.enter('setTeacherUsername');
    }
  });
}

export function setGroupName() {
  const setGroupName = new Scenes.BaseScene('setGroupName');
  setGroupName.enter(async (ctx) => {
    await ctx.reply('Введіть назву групи в якій потрібно створити  Викладача');
  });
  setName(setGroupName, GenSetGroupTeacherState);

  return setGroupName;
}

export function setSubGroupName() {
  const setSubGroupName = new Scenes.BaseScene('setSubGroupName');
  setSubGroupName.enter(async (ctx) => {
    await ctx.reply('Введіть назву підгруппи в яку потріно додати Викладача');
  });
  setName(setSubGroupName, GenSetGroupTeacherState);
  return setSubGroupName;
}

export function setTeacherUsername() {
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
        ? await setAdminSubGroup(ctx)
        : await setAdminGroup(ctx);
      await ctx.scene.leave();
    }
  });
  return teacherUsername;
}

async function setAdminSubGroup(ctx) {
  const group = await Group.findOne({
    groupName: GenSetGroupTeacherState.groupName,
  });

  if (!group) {
    new Group({
      groupName: GenSetGroupTeacherState.groupName,
      students: Array,
    }).save();
    await ctx.reply(`Группа стоврена ${GenSetGroupTeacherState.groupName}`);
  }

  const admin = await Admin.findOne({
    username: GenSetGroupTeacherState.teacherUsername,
  });
  if (!admin) {
    new Admin({
      username: GenSetGroupTeacherState.teacherUsername,
      group: GenSetGroupTeacherState.groupName,
      subGroup: GenSetGroupTeacherState.subGroupName,
    }).save();
  }

  Group.findOneAndUpdate(
    { groupName: GenSetGroupTeacherState.groupName },
    {
      $push: {
        subGroup: {
          groupName: GenSetGroupTeacherState.subGroupName,
          students: [],
        },
      },
      $set: {
        groupName: GenSetGroupTeacherState.groupName,
      },
    },
    { new: true },
    (err) => {
      if (err) console.log(err);
    }
  );
  Admin.findOneAndUpdate(
    { username: GenSetGroupTeacherState.teacherUsername },
    {
      $set: {
        group: GenSetGroupTeacherState.groupName,
        subGroup: GenSetGroupTeacherState.subGroupName,
      },
    },
    { new: true },
    (err) => {
      if (err) console.log(err);
      GenSetGroupTeacherState.groupName = '';
      GenSetGroupTeacherState.teacherUsername = '';
      GenSetGroupTeacherState.subGroupName = '';
      GenSetGroupTeacherState.subGroup = false;
      GenSetGroupTeacherState.action = '';
    }
  );
  await ctx.reply(
    `Викладач ${GenSetGroupTeacherState.teacherUsername} закріпленний за групою ${GenSetGroupTeacherState.groupName}
та підгрупою ${GenSetGroupTeacherState.subGroupName}
Всі наступні повідомлння будуть відправлятися учням`
  );
}

async function setAdminGroup(ctx) {
  const group = await Group.findOne({
    groupName: GenSetGroupTeacherState.groupName,
  });
  if (!group) {
    new Group({
      groupName: GenSetGroupTeacherState.groupName,
      students: Array,
    }).save();
    await ctx.reply(`Группа стоврена ${GenSetGroupTeacherState.groupName}`);
  }
  const admin = await Admin.findOne({
    username: GenSetGroupTeacherState.teacherUsername,
  });
  if (!admin) {
    new Admin({
      username: GenSetGroupTeacherState.teacherUsername,
      group: GenSetGroupTeacherState.groupName,
    }).save();
  }
  Admin.findOneAndUpdate(
    { username: GenSetGroupTeacherState.teacherUsername },
    {
      $set: { group: GenSetGroupTeacherState.groupName },
    },
    { new: true },
    (err) => {
      if (err) console.log(err);
      GenSetGroupTeacherState.groupName = '';
      GenSetGroupTeacherState.teacherUsername = '';
      GenSetGroupTeacherState.subGroupName = '';
      GenSetGroupTeacherState.subGroup = false;
      GenSetGroupTeacherState.action = '';
    }
  );
  await ctx.reply(
    `Викладач ${GenSetGroupTeacherState.teacherUsername} закріпленний за групою ${GenSetGroupTeacherState.groupName}
      Всі наступні повідомлння будуть відправлятися учням          `
  );
}
