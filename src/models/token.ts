/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { Model, model, Schema } from "mongoose";
import { ITokenModel } from "@/types/schema";
import { VERIFICATION_TYPE } from "@/constants/enums";

const TokenSchema = new Schema<ITokenModel>({
  id: {
    type: Number,
  },
  otp: {
    type: String,
    // unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: VERIFICATION_TYPE,
  },
  phone: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  expiresAt: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    // required: true,
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

const TokenModel: Model<ITokenModel> = model<ITokenModel>("Token", TokenSchema);
export default TokenModel;
