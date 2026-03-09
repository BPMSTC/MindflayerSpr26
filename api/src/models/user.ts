import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  token: string;
  create_date: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  token: { type: String },
  create_date: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
