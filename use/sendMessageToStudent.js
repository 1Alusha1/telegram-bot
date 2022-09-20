import Group from '../model/Group.js';
import Student from '../model/Student.js';

export default async function sendMessageToStudent(ctx, adminGroup) {
  const group = await Group.findOne({ groupName: adminGroup });
  if (!group) {
    return await ctx.reply('В вашій группі поки немає студентів');
  }

  group.students.forEach((student) => {
    ctx.telegram
      .sendMessage(String(student.student.id), ctx.message.text)
      .catch((err) => {
        console.log(err);
        Student.findOneAndDelete({ id: student.student.id }, (err) => {
          if (err) console.log(err);
        });
        Group.findOneAndUpdate(
          {
            groupName: group.groupName,
          },
          { $pull: { students: student } },
          { new: true },
          (err) => {
            if (err) console.log(err);
          }
        );
      });
  });
  ctx.reply('Повідомлення відправлене');
}
