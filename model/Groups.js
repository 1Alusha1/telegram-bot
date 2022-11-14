import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const GroupsSchema = new Schema({
  groupName: String,
  students: Array,
  admin: String,
});

export default mongoose.model('Groups', GroupsSchema);
