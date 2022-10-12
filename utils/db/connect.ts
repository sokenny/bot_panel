import mongoose from 'mongoose';
export default async ()=> mongoose.connect(process.env.DB_URL || "");