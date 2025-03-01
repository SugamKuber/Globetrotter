import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});

export const User = model<IUser>("User", UserSchema);