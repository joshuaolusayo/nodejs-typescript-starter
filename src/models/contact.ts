/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { Model, model, Schema } from "mongoose";
import { IContactModel } from "@/types/schema";

const ContactSchema = new Schema<IContactModel>({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
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
});

const ContactModel: Model<IContactModel> = model<IContactModel>(
  "Contact",
  ContactSchema
);
export default ContactModel;
