import 'dotenv/config';
import mongoose from 'mongoose';

export default async function main() {
  await mongoose.connect(process.env.DB_URI);
}
