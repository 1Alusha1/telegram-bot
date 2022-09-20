import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  id: Number,
  username: String,
  group: String,
  fullname: String,
});

export default mongoose.model('Student', StudentSchema);
