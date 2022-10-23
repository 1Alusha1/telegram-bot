import MainGroup from '../model/MainGroup.js';

export default async function verificationOfCreatedGroups(state) {
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
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}
