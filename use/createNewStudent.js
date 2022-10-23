import Student from '../model/Student.js';

export default async function createNewStudent(ctx) {
  try {
    new Student({
      id: ctx.update.callback_query.from.id,
      username: ctx.update.callback_query.from.first_name,
    }).save();
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}
