import { Scenes, Markup } from 'telegraf';
import actionButton from '../use/actionButtons.js';
import Group from '../model/Group.js';
import Admin from '../model/Admin.js';
/**
 * проверяем админ ли пишет
 * проверяем если студент зареган
 * то кидаем сообщение что не нужна два раза писать команду
 * да выводим сообщение
 * нет здроваемся со студентом
 * прыгаем в сцена с вопросом об имени
 * и уже там его регеструем
 * после прыгаем в сцену выбора группи
 * когда группу выберут выходим из сценн
 */
const GenSetGroupTeacherState = {
  groupName: '',
  teacherUsername: '',
};

class SceneGenerator {
  GenChooseGroup() {
    const chooseGroup = new Scenes.BaseScene('chooseGroup');

    chooseGroup.enter(async (ctx) => {
      const group = await Group.find();

      if (!group) {
        return ctx.reply('Груп поки немає');
      }

      await ctx.reply('Обери свою групу');

      const arr = [];
      group.forEach((item) => {
        arr.push(
          Markup.button.callback(`${item.groupName}`, `${item.groupName}`)
        );
      });

      await ctx.replyWithHTML(
        '<b>Групи:</b>',
        Markup.inlineKeyboard([arr])
      );

      actionButton(group, chooseGroup);
      await ctx.scene.leave();
    });

    return chooseGroup;
  }
  GenCreateGroup() {
    const createGroup = new Scenes.BaseScene('createGroup');

    createGroup.enter(async (ctx) => {
      ctx.reply('Input group name');
    });

    createGroup.on('text', async (ctx) => {
      const groupName = String(ctx.message.text);
      const group = await Group.findOne({ groupName });

      if (!group) {
        new Group({
          groupName,
          students: Array,
        }).save();

        await ctx.reply(`
          Ви створили группу ${groupName}, всі наступні повідомлення будуь відправлятися студентам
        `);
        return await ctx.scene.leave();
      }

      await ctx.reply('this group already exist');
      await ctx.scene.reenter('createGroup');
    });
    return createGroup;
  }
  GenSetGroupTeacher() {
    const setGroupTeacher = new Scenes.BaseScene('setGroupTeacher');

    setGroupTeacher.enter(async (ctx) => {
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
        }
      );

      await ctx.reply(
        `Викладач ${GenSetGroupTeacherState.teacherUsername} закріпленний за групою ${GenSetGroupTeacherState.groupName}
Всі наступні повідомлння будуть відправлятися учням
        `
      );
    });
    return setGroupTeacher;
  }

  GenGroupName() {
    const groupName = new Scenes.BaseScene('groupName');

    groupName.enter(async (ctx) => {
      await ctx.reply('Введіть назву группи в яку потріно додати Викладача');
    });

    groupName.on('text', async (ctx) => {
      GenSetGroupTeacherState.groupName = String(ctx.message.text);

      if (GenSetGroupTeacherState.groupName) {
        await ctx.reply(
          `Вы обрали группу ${GenSetGroupTeacherState.groupName}`
        );
        return ctx.scene.enter('teacherUsername');
      }
      ctx.scene.reenter();
    });

    return groupName;
  }

  GenTeacherUsername() {
    const teacherUsername = new Scenes.BaseScene('teacherUsername');

    teacherUsername.enter(async (ctx) => {
      await ctx.reply(`Введіть username з телеграму викладача `);
    });

    teacherUsername.on('text', async (ctx) => {
      GenSetGroupTeacherState.teacherUsername = String(ctx.message.text);

      if (GenSetGroupTeacherState.teacherUsername) {
        await ctx.reply(
          `Вы обрали Выкладача ${GenSetGroupTeacherState.teacherUsername}`
        );
        return ctx.scene.enter('setGroupTeacher');
      }
    });
    return teacherUsername;
  }
}

export default new SceneGenerator();
