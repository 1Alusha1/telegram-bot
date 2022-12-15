import message from '../message.js';

import Groups from '../model/Groups.js';
import Admin from '../model/Admin.js';
import Student from '../model/Student.js';
import { state } from '../state.js';

export default async function sendMessageToStudent(ctx, group) {
  try {
    let groupName;
    const username = ctx.message.from.username;
    if (!state.groupName) {
      const admin = await Admin.findOne({ username });
      groupName = admin.group;
    } else {
      groupName = state.groupName;
    }
    if (!group.students.length) {
      return ctx.reply(message().noHaveStudents);
    }

    group.students.forEach((student) => {
      ctx.telegram
        .sendMessage(String(student.student.id), ctx.message.text)
        .catch((err) => {
          Student.findOneAndDelete({ id: student.student.id }, (err) => {
            if (err) console.log(err);
          });
          Groups.findOneAndUpdate(
            {
              groupName: groupName,
            },
            { $pull: { students: student } },
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
