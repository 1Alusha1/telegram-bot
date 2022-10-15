import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  id: Number,
  username: String,
  group: String,
  subGroup: String,
});

export default mongoose.model('Admin', AdminSchema);
