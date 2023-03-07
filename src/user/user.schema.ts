import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: String,
  username: { type: String, unique: true },
  password: String,
});

export interface User extends mongoose.Document {
  id: string;
  username: string;
  password: string;
}

export const UserModel = mongoose.model<User>('User', UserSchema);
