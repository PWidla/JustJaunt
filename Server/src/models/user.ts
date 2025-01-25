import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "user", versionKey: false }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export { User };
