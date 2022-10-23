import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const GroupsSchema = new Schema({
  groupName: String,
  students: Array,
});

export default mongoose.model('Groups', GroupsSchema);
