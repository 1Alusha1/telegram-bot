import MainGroup from '../model/MainGroup.js';

export default async function checksMainGroups(state) {
  try {
    const mainGroup = await MainGroup.findOne({
      groupName: state.groupName,
    });

    if (!mainGroup) {
      await new MainGroup({
        groupName: state.groupName,
      }).save();
    }
  } catch (err) {
    if (err) console.log(err);
  }
}
