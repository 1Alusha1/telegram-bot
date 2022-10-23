import checksMainGroups from './checksMainGroups.js';
import Groups from '../model/Groups.js';
import Admin from '../model/Admin.js';

export default async function setAdminGroup(ctx, state) {
  try {
    //створює запис в у моделі основних груп
    checksMainGroups(state);

    //Створює запис в моделі основних груп
    const groups = await Groups.findOne({
      groupName: state.groupName,
    });
    if (!groups) {
      new Groups({
        groupName: state.groupName,
        students: Array,
      }).save();
      await ctx.reply(`Група стоврена ${state.groupName}`);
    }

    //Створюємо адміна групи якщо його немає
    const admin = await Admin.findOne({
      username: state.teacherUsername,
    });
    if (!admin) {
      new Admin({
        username: state.teacherUsername,
        group: state.groupName,
        subGroup: '',
      }).save();
    }

    await ctx.reply(
      `Викладач ${state.teacherUsername} закріпленний за групою ${state.groupName}
Всі наступні повідомлння будуть відправлятися учням          `
    );

    state.groupName = '';
    state.teacherUsername = '';
    state.subGroupName = '';
    state.subGroup = false;
    state.action = '';
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}
