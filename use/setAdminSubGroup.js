import checksMainGroups from './checksMainGroups.js';
import Groups from '../model/Groups.js';
import Admin from '../model/Admin.js';
import MainGroup from '../model/MainGroup.js';

import message from '../message.js';
export default async function setAdminSubGroup(ctx, state) {
  try {
    //створює запис в у моделі основних груп
    await checksMainGroups(state);

    // перевірка існуючих груп
    await verificationOfCreatedGroups(state);

    // створює групу якщо її немає
    const groups = await Groups.findOne({
      groupName: state.subGroupName,
    });
    if (!groups) {
      await new Groups({
        groupName: state.subGroupName,
        admin: state.teacherUsername,
      }).save();
    }
    //ствоюрєм адміна підгрупи
    const admin = await Admin.findOne({
      username: state.teacherUsername,
    });

    if (!admin) {
      new Admin({
        username: state.teacherUsername,
        group: state.groupName,
        subGroup: state.subGroupName,
      }).save();
    }
    await ctx.reply(
      message(state.teacherUsername, state.groupName, state.subGroupName)
        .setAdminSubGroup
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

async function verificationOfCreatedGroups(state) {
  try {
    const mainGroup = await MainGroup({
      groupName: state.groupName,
    });
    const isSubGorup = mainGroup.subGroup.filter((subGroup) => {
      return subGroup.groupName === state.subGroupName ? subGroup : false;
    });
    if (!isSubGorup.length) {
      MainGroup.findOneAndUpdate(
        {
          groupName: state.groupName,
        },
        {
          $push: {
            subGroup: { groupName: state.subGroupName },
          },
        },
        (err) => {
          if (err) console.log(err);
        }
      );
    }
  } catch (err) {
    if (err) console.log(err);
  }
}
