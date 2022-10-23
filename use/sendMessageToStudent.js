import Groups from '../model/Groups.js';
import Student from '../model/Student.js';

export default async function sendMessageToStudent(ctx, adminGroup) {
  try {
    const groups = await Groups.findOne({
      groupName: adminGroup.subGroup.length
        ? adminGroup.subGroup
        : adminGroup.group,
    });
    if (!groups) {
      return await ctx.reply('В вашій групі поки немає студентів');
    }
    groups.students.forEach((student) => {
      ctx.telegram
        .sendMessage(String(student.student.id), ctx.message.text)
        .catch((err) => {
          Student.findOneAndDelete({ id: student.student.id }, (err) => {
            if (err) console.log(err);
          });
          Groups.findOneAndUpdate(
            {
              groupName: groups.groupName,
            },
            { $pull: { students: student.student } },
            { new: true },
            (err) => {
              if (err) console.log(err);
            }
          );
        });
    });
    ctx.reply('Повідомлення відправлене');
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}
