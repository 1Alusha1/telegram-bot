import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  id: Number,
  username: String,
  group: String,
  subGroup: String,
});

export default mongoose.model('Student', StudentSchema);
