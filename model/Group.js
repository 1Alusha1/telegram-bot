import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  groupName: String,
  students: Array,
});

export default mongoose.model('Group', GroupSchema);
