/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { Model, model, Schema } from "mongoose";
import { IUserModel } from "@/types/schema";

const UserSchema = new Schema<IUserModel>({
  id: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
  },
  state: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  role: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
  },
  isPhoneVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  profilePicture: {
    type: String,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  timeStamp: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  createdOn: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  updatedOn: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

const UserModel: Model<IUserModel> = model<IUserModel>("User", UserSchema);
export default UserModel;
