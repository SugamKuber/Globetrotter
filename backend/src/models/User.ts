import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId
  fullname: string;
  username: string;
  password: string;
  refreshToken?: string;
}

const UserSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: true },
  refreshToken: { type: String, select: true },
});

export const User = model<IUser>("User", UserSchema);
