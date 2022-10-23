import checksMainGroups from './checksMainGroups.js';
import verificationOfCreatedGroups from './verificationOfCreatedGroups.js';
import Groups from '../model/Groups.js';
import Admin from '../model/Admin.js';

export default async function setAdminSubGroup(ctx, state) {
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
    `Викладач ${state.teacherUsername} закріпленний за групою ${state.groupName}
та підгрупою ${state.subGroupName}
Всі наступні повідомлння будуть відправлятися учням`
  );

  state.groupName = '';
  state.teacherUsername = '';
  state.subGroupName = '';
  state.subGroup = false;
  state.action = '';
}
