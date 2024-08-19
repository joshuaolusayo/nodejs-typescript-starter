/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { Model } from "mongoose";
import UserModel from "./user";
import AdminModel from "./admin";
import TokenModel from "./token";
import ContactModel from "./contact";
import {
  IAdminModel,
  ITokenModel,
  IUserModel,
  IContactModel,
} from "@/types/schema";

export interface Models {
  User: Model<IUserModel>;
  Admin: Model<IAdminModel>;
  Token: Model<ITokenModel>;
  Contact: Model<IContactModel>;
}

export default {
  User: UserModel,
  Admin: AdminModel,
  Token: TokenModel,
  Contact: ContactModel,
} as Models;
