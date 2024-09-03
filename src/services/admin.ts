import { Request, NextFunction } from "express";
import Controller from "@/controllers";
import RootService, { IResult } from "./_root";
import {
  LoginSchema,
  AdminResetPasswordSchema,
  AdminSignupSchema,
  ChangePasswordSchema,
  EmailSchema,
  UpdateAdminSchema,
} from "@/validations/user";
import {
  comparePasswords,
  generateNewPassword,
  generateOTP,
  generateJwtToken,
  encryptPassword,
} from "@/utilities/general";
import {
  buildQuery as build_query,
  buildWildcardOptions as build_wildcard_options,
} from "../utilities/buildQuery";
import { IdSchema } from "@/validations/general";
import { IDocument, ITokenModel, IAdminModel } from "@/types/schema";
import { VERIFICATION_TYPE } from "@/constants/enums";
import appEvent from "@/events/_index";
import ALL_EVENTS from "@/events/allEvents";
import Environment from "@/config/env";

class AdminService extends RootService {
  adminControllerInstance: Controller<IAdminModel>;
  tokenControllerInstance: Controller<ITokenModel>;

  constructor(
    admin_controller: Controller<IAdminModel>,
    tokenControllerInstance: Controller<ITokenModel>
  ) {
    super();
    this.adminControllerInstance = admin_controller;
    this.tokenControllerInstance = tokenControllerInstance;
  }

  async readRecordById(request: Request, next: NextFunction) {
    try {
      const { id } = request.params;
      if (!id) {
        return this.processFailedResponse("Invalid ID supplied.");
      }

      const result = await this.adminControllerInstance.readRecords({
        _id: id,
        ...this.query_meta,
      });

      if (result?.data && result.data.length > 0) {
        return this.processSingleRead(result.data[0]);
      } else {
        return this.processFailedResponse("Admin not found", 404);
      }
    } catch (e) {
      console.error(e, "readRecordById");
      return next(e);
    }
  }

  async readRecordsByFilter(request: Request, next: NextFunction) {
    try {
      const { query } = request;
      const result = await this.handleDatabaseRead(
        this.adminControllerInstance,
        query,
        {
          ...this.query_meta,
        }
      );
      return this.processMultipleReadResults(result);
    } catch (e) {
      console.error(e, "readRecordsByFilter");
      next(e);
    }
  }

  async readRecordsByFilterBulk(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const result = await this.handleDatabaseRead(
        this.adminControllerInstance,
        body,
        {
          ...this.query_meta,
        }
      );
      return this.processMultipleReadResults(result);
    } catch (e) {
      console.error(e, "readRecordsByFilterBulk");
      next(e);
    }
  }

  async readRecordsByWildcard(request: Request, next: NextFunction) {
    try {
      const { params, query } = request;

      if (!params.keys) {
        return this.processFailedResponse("Invalid key/keyword", 400);
      }

      const wildcardConditions = build_wildcard_options(
        params.keys,
        query.keyword?.toString() ?? ""
      );
      delete query.keyword;
      const result = await this.handleDatabaseRead(
        this.adminControllerInstance,
        query,
        {
          ...wildcardConditions,
          ...this.query_meta,
        }
      );
      return this.processMultipleReadResults(result);
    } catch (e) {
      console.error(e, "readRecordsByWildcard");
      next(e);
    }
  }

  async updateRecordById(request: Request, next: NextFunction) {
    try {
      const { id } = request.params;
      const data = request.body;

      if (!id) {
        return this.processFailedResponse("Invalid ID supplied.");
      }

      const { error } = IdSchema.validate({ id });
      if (error) return this.processValidationsErrors(error);

      const new_data = this.deleteRecordMetadata(data);
      const result = await this.adminControllerInstance.updateRecords(
        { _id: id },
        { ...new_data }
      );

      return this.processUpdateResult({ ...result, ...data });
    } catch (e) {
      console.error(e, "updateRecordById");
      next(e);
    }
  }

  async updateUserRecord(request: Request, next: NextFunction) {
    try {
      const { _id: id } = request.user;
      // console.log({ id });
      const data = request.body;

      const { error } = UpdateAdminSchema.validate(data, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      const new_data = this.deleteRecordMetadata(data);
      const result = await this.adminControllerInstance.updateRecords(
        { _id: id },
        { ...new_data }
      );

      return this.processUpdateResult({ ...result });
    } catch (e) {
      console.error(e, "updateRecordById");
      next(e);
    }
  }

  async updateRecords(request: Request, next: NextFunction) {
    try {
      const { options, data } = request.body;
      const { seek_conditions } = build_query(options);

      const new_data = this.deleteRecordMetadata(data);
      const result = await this.adminControllerInstance.updateRecords(
        { ...seek_conditions },
        { ...new_data }
      );
      return this.processUpdateResult({ ...new_data, ...result });
    } catch (e) {
      console.error(e, "updateRecords");
      next(e);
    }
  }

  async deleteRecordById(request: Request, next: NextFunction) {
    try {
      const { id } = request.params;
      if (!id) {
        return this.processFailedResponse("Invalid ID supplied.");
      }

      const { error } = IdSchema.validate({ id });
      if (error) return this.processValidationsErrors(error);

      const result = await this.adminControllerInstance.deleteRecords({
        _id: id,
      });

      return this.process_delete_result(result);
    } catch (e) {
      next(e);
    }
  }

  async fetchCurrentAdmin(request: Request, next: NextFunction) {
    const currentUser = request.user;
    try {
      const result = await this.adminControllerInstance.readRecords(
        { _id: currentUser._id, ...this.standardQueryMeta }
        // "firstName lastName email"
      );

      if (result?.data && result.data.length > 0) {
        return this.processSingleRead(result.data[0]);
      }

      return this.processFailedResponse("Admin not found", 404);
    } catch (e) {
      next(e);
    }
  }

  async createAdmin(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = AdminSignupSchema.validate(body, { abortEarly: false });

      if (error) return this.processValidationsErrors(error);

      const { email, phone } = body;

      const foundExistingUsers = await this.adminControllerInstance.readRecords(
        {
          $or: [
            {
              email: email.trim().toLowerCase(),
            },
            { phone },
          ],
        }
      );

      if (foundExistingUsers?.data?.length) {
        return this.processFailedResponse(
          "Admin with the email already exists",
          409
        );
      }

      const password = generateNewPassword();
      const newPassword = await encryptPassword(password);

      // TODO: Remove password from this payload
      const result = await this.adminControllerInstance.createRecord({
        ...body,
        email: email.trim().toLowerCase(),
        password: newPassword,
      });

      appEvent.emit(ALL_EVENTS.sendEmail, {
        subject: "Account registration successful",
        recipientEmail: email.trim().toLowerCase(),
        message: `Welcome ${body.firstName} ${body.lastName}. Your new password is <span style="font-weight:bold">${password}</span>. You can log in with it and change it if you wish. Ensure you keep your password safe.`,
        username: `${body.firstName} ${body.lastName}`,
      });

      return this.processSingleRead({ ...result, password } as IDocument);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async changePassword(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = ChangePasswordSchema.validate(body, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      const { password, newPassword } = body;

      const currentUser = await this.adminControllerInstance.readRecords({
        _id: request.user._id,
        ...this.standardQueryMeta,
      });

      if (!currentUser?.data?.length)
        return this.processFailedResponse("User not found");
      const userInfo = currentUser.data[0];

      const isPasswordCorrect = await comparePasswords(
        password,
        userInfo.password
      );

      if (isPasswordCorrect) {
        const encryptedPassword = await encryptPassword(newPassword);

        const updateUserPassword =
          await this.adminControllerInstance.updateRecords(
            {
              _id: request.user._id,
            },
            {
              password: encryptedPassword,
            }
          );

        return this.processUpdateResult({
          ...updateUserPassword,
          message: "Password updated successfully",
        } as IResult);
      }

      return this.processFailedResponse("Your current password is not correct");
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async initiateResetPassword(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = EmailSchema.validate(body, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      const { email } = body;

      const existingUser = await this.adminControllerInstance.checkIfExists(
        "Admin",
        {
          email: email.trim().toLowerCase(),
          ...this.standardQueryMeta,
        }
      );

      if (!existingUser)
        return this.processFailedResponse("Admin with that email not found");

      const otpCode = generateOTP();

      await this.tokenControllerInstance.createRecord({
        type: VERIFICATION_TYPE.RESET_PASSWORD,
        otp: otpCode,
        email: email.trim().toLowerCase(),
        expiresAt: Date.now() + 1200000, // 20mins
      });

      const link = `${
        Environment.FRONTEND_URL
      }/admins/reset-password?otp=${otpCode}&email=${email
        .trim()
        .toLowerCase()}`;

      appEvent.emit(ALL_EVENTS.sendEmail, {
        subject: "Reset Password OTP",
        recipientEmail: email.trim().toLowerCase(),
        message: `Hi! Password Reset Token: <span style="font-weight:bold">${otpCode}</span>. You can use this link instead: <span style="font-weight:bold">${link}</span>`,
      });

      return this.processSuccessfulResponse({
        message: "Password otp sent",
        resetOtp: otpCode,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async resetPassword(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = AdminResetPasswordSchema.validate(body, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      const { email, password, otp } = body;

      const currentUser = await this.adminControllerInstance.readRecords({
        email: email.trim().toLowerCase(),
        ...this.standardQueryMeta,
      });

      if (!currentUser?.data?.length)
        return this.processFailedResponse("User with the email not found");

      if (!currentUser?.data[0]?.password)
        return this.processFailedResponse("Password must be set first", 403);

      const isResetTokenValid =
        await this.tokenControllerInstance.checkIfExists("Token", {
          email: email.trim().toLowerCase(),
          type: VERIFICATION_TYPE.RESET_PASSWORD,
          otp,
          expiresAt: { $gte: Date.now() },
          ...this.standardQueryMeta,
        });

      if (!isResetTokenValid) {
        return this.processFailedResponse(
          "Token is not valid or it has expired.",
          400
        );
      }

      await this.tokenControllerInstance.updateRecords(
        {
          email: email.trim().toLowerCase(),
          type: VERIFICATION_TYPE.RESET_PASSWORD,
          otp,
        },
        { isActive: false }
      );

      const newPassword = await encryptPassword(password);

      const changeUserPassword =
        await this.adminControllerInstance.updateRecords(
          {
            email: email.trim().toLowerCase(),
          },
          {
            password: newPassword,
          }
        );

      return this.processUpdateResult({
        ...changeUserPassword,
        message: "Password updated successfully",
      } as IResult);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async login(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = LoginSchema.validate(body);
      if (error) return this.processValidationsErrors(error);

      const { password, email } = request.body;

      const result = await this.adminControllerInstance.readRecords({
        email,
        ...this.standardQueryMeta,
      });

      if (result && result.data.length) {
        const userRecord = result.data[0];

        const isPasswordCorrect = await comparePasswords(
          password,
          userRecord.password
        );

        if (isPasswordCorrect) {
          const accessToken = generateJwtToken(
            userRecord._id,
            // userRecord.phone,
            userRecord.email
          );
          return this.processSuccessfulResponse({
            user: userRecord,
            token: accessToken,
          });
        }
      }

      return this.processFailedResponse("Invalid password or phone");
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

const AdminControllerInstance = new Controller<IAdminModel>("Admin");
const TokenControllerInstance = new Controller<ITokenModel>("Token");

export default new AdminService(
  AdminControllerInstance,
  TokenControllerInstance
);
