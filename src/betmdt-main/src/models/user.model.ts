import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  address?: string;
  role?: Schema.Types.ObjectId;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: String,
    phone: String,
    address: String,
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
