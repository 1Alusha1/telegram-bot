import message from '../message.js';

import Groups from '../model/Groups.js';
import Student from '../model/Student.js';

export default async function sendMessageToStudent(ctx, group) {
  try {
    group.students.forEach((student) => {
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
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(message().error);
  }
}
