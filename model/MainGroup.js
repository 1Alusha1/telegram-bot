import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MainGroupSchema = new Schema({
  groupName: String,
  subGroup: Array,
});

export default mongoose.model('MainGroup', MainGroupSchema);
