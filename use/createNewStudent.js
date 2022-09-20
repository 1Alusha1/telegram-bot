import Student from '../model/Student.js';

export default async function createNewStudent(ctx) {
  new Student({
    id: ctx.message.from.id,
    username: ctx.message.from.first_name,
  }).save();
}
