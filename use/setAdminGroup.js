import checksMainGroups from './checksMainGroups.js';
import Groups from '../model/Groups.js';
import Admin from '../model/Admin.js';

import message from '../message.js';

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
      message(state.teacherUsername, state.groupName).setAdminGroup
    );

    state.groupName = '';
    state.teacherUsername = '';
    state.subGroupName = '';
    state.subGroup = false;
    state.action = '';
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(message().error);
  }
}
