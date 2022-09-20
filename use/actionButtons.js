import Student from '../model/Student.js';
import Group from '../model/Group.js';

export default function actionButton(array, bot) {
  array.forEach((item) => {
    bot.action(item.groupName, async (ctx) => {
      try {
        ctx.answerCbQuery();
        const userId = ctx.update.callback_query.from.id;
        const student = await Student.findOne({ id: userId });

        if (!student.group) {
          Student.findOneAndUpdate(
            {
              id: Number(userId),
            },
            { $set: { group: item.groupName } },
            { new: true },
            (err) => {
              if (err) console.log(err);
            }
          );
        }

        await ctx.reply(`Ти приєднався до групи: ${item.groupName}`);

        const group = await Group.findOne({ groupName: item.groupName });

        if (!group) {
          await new Group({
            groupName: item.groupName,
            Array: [],
          }).save();
        }

        Group.findOneAndUpdate(
          { groupName: item.groupName },
          { $push: { students: { student } } },
          { new: true },
          (err) => {
            if (err) console.log(err);
          }
        );
      } catch (err) {
        if (err) console.log(err);
        ctx.reply(
          'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
        );
      }
    });
  });
}
