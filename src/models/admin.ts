/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { Model, model, Schema } from "mongoose";
import { IAdminModel } from "@/types/schema";
import { AdminRole } from "@/constants/enums";

const AdminSchema = new Schema<IAdminModel>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  // phone: {
  //   code: {
  //     type: Number,
  //     default: 234,
  //     minlength: 1,
  //     maxlength: 3,
  //     required: true,
  //   },
  //   number: {
  //     type: Number,
  //     minlength: 10,
  //     required: true,
  //   },
  // },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: Object.values(AdminRole),
    default: AdminRole.ADMIN,
  },
  password: {
    type: String,
    required: true,
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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    // required: true,
  },
});

const AdminModel: Model<IAdminModel> = model<IAdminModel>("Admin", AdminSchema);
export default AdminModel;
