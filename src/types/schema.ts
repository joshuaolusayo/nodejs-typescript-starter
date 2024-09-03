import { AdminRole } from "@/constants/enums";
import { Schema } from "mongoose";

export type PhoneNumberType = {
  code: string;
  number: string;
};

export interface ILanguageModel extends IBaseModel {
  code: string;
  name: string;
}

export interface IUserModel extends IBaseModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  gender: string;
  dateOfBirth?: Date;
  id: number;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  role: string;
  state?: string;
  profilePicture?: string;
}

export interface IAdminModel extends IBaseModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  // phone: PhoneNumberType;
  phone: string;
  createdBy: Schema.Types.ObjectId;
}

export interface ITokenModel extends IBaseModel {
  otp?: string;
  type: string;
  phone?: string;
  email?: string;
  expiresAt?: Date;
}

export interface IContactModel extends IBaseModel {
  name: string;
  email: string;
  message: string;
}

export interface IBaseModel extends Document {
  _id: string;
  id: number;
  isActive: boolean;
  isDeleted: boolean;
  timeStamp: Date;
  createdOn: Date;
  updatedOn: Date;
}

export interface IDocument extends IBaseModel {}
