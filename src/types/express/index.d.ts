import { IUserModel } from "../schema";

declare global {
  namespace Express {
    export interface Request {
      headers: { authorization: any };
      payload: any; // Replace 'any' with the appropriate type for your payload
      user: IUserModel;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export = Express;
