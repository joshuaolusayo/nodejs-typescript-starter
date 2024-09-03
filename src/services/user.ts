import { Request, NextFunction } from "express";
import Controller from "@/controllers";
import RootService, { IResult } from "./_root";
import {
  AuthSchema,
  ChangePasswordSchema,
  EmailSchema,
  LoginSchema,
  PhoneNumberSchema,
  ResetPasswordSchema,
  SetPasswordSchema,
  UpdateProfileSchema,
  UserSignupSchema,
  VerifyEmailOtpSchema,
  VerifyPhoneOtpSchema,
} from "@/validations/user";
import {
  comparePasswords as isMatchingPassword,
  generateOTP as generateOtp,
  generateJwtToken,
  getPhoneNumber as getPhoneNumber,
  encryptPassword,
} from "@/utilities/general";
import {
  buildQuery as build_query,
  buildWildcardOptions as buildWildcardOptions,
} from "../utilities/buildQuery";
import { IdSchema } from "@/validations/general";
import {
  IBaseModel,
  IDocument,
  ITokenModel,
  IUserModel,
  PhoneNumberType,
} from "@/types/schema";
import { VERIFICATION_TYPE } from "@/constants/enums";
import appEvent from "@/events/_index";
import ALL_EVENTS from "@/events/allEvents";
import { S3FileType } from "@/types/general";
import Environment from "@/config/env";
// import { S3FileType } from "@/utilities/storage/config";

export interface IExtendedUserModel extends IBaseModel {
  pin: string;
}

class UserService extends RootService {
  userController: Controller<IUserModel>;
  tokenController: Controller<ITokenModel>;

  constructor(
    user_controller: Controller<IUserModel>,
    tokenControllerInstance: Controller<ITokenModel>
  ) {
    super();
    this.userController = user_controller;
    this.tokenController = tokenControllerInstance;
  }

  async readRecordById(request: Request, next: NextFunction) {
    try {
      const { id } = request.params;
      if (!id) {
        return this.processFailedResponse("Invalid ID supplied.");
      }

      const result = await this.userController.readRecords({
        _id: id,
        ...this.standardQueryMeta,
      });

      if (result?.data && result.data.length > 0) {
        return this.processSingleRead(result.data[0]);
      } else {
        return this.processFailedResponse("User not found", 404);
      }
    } catch (e) {
      console.error(e, "readRecordById");
      return next(e);
    }
  }

  async readRecordsByFilter(request: Request, next: NextFunction) {
    try {
      const { query } = request;
      const result = await this.handleDatabaseRead(this.userController, query, {
        ...this.standardQueryMeta,
      });
      return this.processMultipleReadResults(result);
    } catch (e) {
      console.error(e, "readRecordsByFilter");
      next(e);
    }
  }

  async readRecordsByFilterBulk(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const result = await this.handleDatabaseRead(this.userController, body, {
        ...this.standardQueryMeta,
      });
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

      const wildcardConditions = buildWildcardOptions(
        params.keys,
        query.keyword?.toString() ?? ""
      );
      delete query.keyword;
      const result = await this.handleDatabaseRead(this.userController, query, {
        ...wildcardConditions,
        ...this.standardQueryMeta,
      });
      return this.processMultipleReadResults(result);
    } catch (e) {
      console.error(e, "readRecordsByWildcard");
      next(e);
    }
  }

  async updateUserRecord(request: Request, next: NextFunction) {
    try {
      const { _id: id } = request.user;
      const data = request.body;

      const { error } = UpdateProfileSchema.validate(data, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      const new_data = this.deleteRecordMetadata(data);
      const result = await this.userController.updateRecords(
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
      const result = await this.userController.updateRecords(
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

      const result = await this.userController.deleteRecords({
        _id: id,
      });

      return this.process_delete_result(result);
    } catch (e) {
      next(e);
    }
  }

  async getCurrentUser(request: Request, next: NextFunction) {
    const currentUser = request.user;
    const { query } = request;

    try {
      const result = await this.handleDatabaseRead(
        this.userController,
        {
          _id: currentUser._id,
          ...query,
        },
        {
          ...this.standardQueryMeta,
        }
      );

      if (result?.data && result.data.length > 0) {
        return this.processSingleRead(result.data[0]);
      } else {
        return this.processFailedResponse("User not found", 400);
      }
    } catch (e) {
      console.log("getCurrentUser", e);
      next(e);
    }
  }

  async createUser(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = UserSignupSchema.validate(body, { abortEarly: false });
      if (error) return this.processValidationsErrors(error);

      const { email } = body;

      const existingUsers = await this.userController.readRecords({
        email,
      });

      if (existingUsers?.data?.length) {
        return this.processFailedResponse("User with the email already exists");
      }

      const encryptedPassword = await encryptPassword(body.password);

      const result = await this.userController.createRecord({
        ...body,
        password: encryptedPassword,
        email: email.trim().toLowerCase(),
      });

      const otpCode = generateOtp();

      await this.tokenController.createRecord({
        type: VERIFICATION_TYPE.EMAIL_VERIFICATION,
        otp: otpCode,
        email: email.trim().toLowerCase(),
        expiresAt: Date.now() + 1200000, // 20mins
      });

      const link = `${
        Environment.FRONTEND_URL
      }/verify-email?otp=${otpCode}&email=${email.trim().toLowerCase()}`;

      appEvent.emit(ALL_EVENTS.sendEmail, {
        subject: "Account registration successful",
        recipientEmail: email.trim().toLowerCase(),
        message: `Welcome ${body.firstName} ${body.lastName}. Your new password is <span style="font-weight:bold">${body.password}</span>. Use this link to activate your account: ${link}.`,
        username: `${body.firstName} ${body.lastName}`,
      });

      return this.processSingleRead({
        ...result,
        verificationOtp: otpCode,
      } as IDocument);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async testSMS(request: Request, next: NextFunction) {
    appEvent.emit(ALL_EVENTS.sendSMS, {
      phoneNumber: request.body.phone,
      message: `Your verification code is: 123456`,
    });
    return this.processSuccessfulResponse({});
  }

  async testEmail(request: Request, next: NextFunction) {
    appEvent.emit(ALL_EVENTS.sendEmail, {
      subject: "Testing something",
      recipientEmail: "username@email.com",
      preHeader: "Testing",
      username: "Username",
      // phoneNumber: request.body.phone,
      message: `Your verification code is: 123456`,
    });
    return this.processSuccessfulResponse({});
  }

  async verifyEmailOtp(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = VerifyEmailOtpSchema.validate(body, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      const { email: userEmail, otp } = body;
      const email = userEmail.trim().toLowerCase();

      const { error: verifyEmailError } = await this.checkIfEmailIsVerified(
        email
      );

      if (verifyEmailError) return this.processFailedResponse(verifyEmailError);

      const checkIfTokenExists = await this.tokenController.checkIfExists(
        "Token",
        {
          email,
          type: VERIFICATION_TYPE.EMAIL_VERIFICATION,
          otp,
          expiresAt: { $gte: Date.now() },
          ...this.standardQueryMeta,
        }
      );

      if (!checkIfTokenExists) {
        return this.processFailedResponse(
          "Token is not valid or it has expired.",
          400
        );
      }

      await this.tokenController.updateData(
        "Token",
        {
          email,
          type: VERIFICATION_TYPE.EMAIL_VERIFICATION,
          otp,
        },
        { isActive: false }
      );

      const result = await this.userController.updateRecords(
        { email },
        { isEmailVerified: true }
      );

      return this.processUpdateResult({ ...result });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async requestEmailVerificationOTP(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = EmailSchema.validate(body, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      const { email: userEmail } = body;
      const email = userEmail.trim().toLowerCase();

      const { error: verifyEmailError } = await this.checkIfEmailIsVerified(
        email
      );

      if (verifyEmailError) return this.processFailedResponse(verifyEmailError);

      const expiresAt = Date.now() + 1200000; // 20mins
      const otp = generateOtp();

      const tokenRecord = await this.tokenController.readRecords({
        type: VERIFICATION_TYPE.EMAIL_VERIFICATION,
        email,
        ...this.standardQueryMeta,
      });

      if (tokenRecord && tokenRecord.data.length) {
        await this.tokenController.updateRecords(
          {
            type: VERIFICATION_TYPE.EMAIL_VERIFICATION,
            email,
            // phone_number: `${phone.code}${phone.number}`,
            _id: tokenRecord.data[0]._id,
          },
          {
            otp,
            expiresAt,
            isActive: true,
          }
        );
      } else {
        await this.tokenController.createRecord({
          type: VERIFICATION_TYPE.EMAIL_VERIFICATION,
          email,
          otp,
          expiresAt,
        });
      }

      const link = `${Environment.FRONTEND_URL}?otp=${otp}&email=${email
        .trim()
        .toLowerCase()}`;

      console.log({ link });

      appEvent.emit(ALL_EVENTS.sendEmail, {
        subject: "Email Verification OTP",
        recipientEmail: email,
        message: `Hi. Your Use this otp to activate your account: ${otp}. Click this link ${link}`,
        // username: `${body.firstName} ${body.lastName}`,
      });

      return this.processSuccessfulResponse({
        message: "Verification token sent",
        verificationToken: otp,
      });
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

      const { email: userEmail } = body;
      const email = userEmail.trim().toLowerCase();

      const { error: verifyEmailError, user: currentUser } =
        await this.checkIfEmailIsNotVerified(email);

      if (verifyEmailError || !currentUser)
        return this.processFailedResponse(verifyEmailError);

      const otpCode = generateOtp();

      await this.tokenController.createRecord({
        type: VERIFICATION_TYPE.RESET_PASSWORD,
        otp: otpCode,
        email,
        expiresAt: Date.now() + 1200000, // 20mins
      });

      const link = `${
        Environment.FRONTEND_URL
      }/reset-password?otp=${otpCode}&email=${email.trim().toLowerCase()}`;

      appEvent.emit(ALL_EVENTS.sendEmail, {
        subject: "Reset Your Password",
        recipientEmail: email.trim().toLowerCase(),
        message: `Hi! Password Reset Token: <span style="font-weight:bold">${otpCode}</span>. You can use this link instead: <span style="font-weight:bold">${link}</span>`,
        username: `${currentUser.firstName} ${currentUser.lastName}`,
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
      const { error } = ResetPasswordSchema.validate(body, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      const { email, password, otp } = body;

      const { error: verifyEmailError, user: currentUser } =
        await this.checkIfEmailIsNotVerified(email);

      if (verifyEmailError) return this.processFailedResponse(verifyEmailError);

      const isTokenValid = await this.tokenController.checkIfExists("Token", {
        email,
        type: VERIFICATION_TYPE.RESET_PASSWORD,
        otp,
        expiresAt: { $gte: Date.now() },
        ...this.standardQueryMeta,
      });

      if (!isTokenValid) {
        return this.processFailedResponse(
          "Token is not valid or it has expired.",
          400
        );
      }

      await this.tokenController.updateRecords(
        {
          email,
          type: VERIFICATION_TYPE.RESET_PASSWORD,
          otp,
        },
        { isActive: false }
      );

      const newPassword = await encryptPassword(password);

      const updatePassword = await this.userController.updateRecords(
        {
          email,
        },
        {
          password: newPassword,
        }
      );

      return this.processUpdateResult({
        ...updatePassword,
        message: "Password updated successfully",
      } as IResult);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async checkIfEmailIsVerified(email: string): Promise<{
    error: string;
  }> {
    const existingUser = await this.userController.readRecords({
      email,
      ...this.standardQueryMeta,
    });

    if (existingUser?.data?.length === 0)
      return { error: "User with this email does not exist" };

    if (existingUser?.data[0].isEmailVerified)
      return {
        error: "Your email is already verified. Proceed to login.",
      };

    return { error: "" };
  }

  async checkIfEmailIsNotVerified(email: string): Promise<{
    error: string;
    user?: IUserModel;
  }> {
    const existingUser = await this.userController.readRecords({
      email,
      ...this.standardQueryMeta,
    });

    if (existingUser?.data?.length === 0)
      return { error: "User with this email does not exist" };

    if (!existingUser?.data[0].isEmailVerified)
      return {
        error: "Verify your email to continue.",
      };

    return { error: "", user: existingUser.data[0] };
  }

  async checkIfPhoneIsVerified(phone: string): Promise<{
    error: string;
  }> {
    const userRecord = await this.userController.readRecords({
      // "phone.code": phone.code,
      // "phone.number": phone.number,
      phone,
      ...this.standardQueryMeta,
    });

    if (userRecord?.data?.length === 0)
      return { error: "User with this phone number does not exist" };

    if (userRecord?.data[0].isPhoneVerified)
      return {
        error: "Your phone number is already verified. Proceed to login.",
      };

    return { error: "" };
  }

  async checkIfPhoneIsNotVerified(phone: string): Promise<{
    error: string;
    user?: IUserModel;
  }> {
    const userRecord = await this.userController.readRecords({
      // "phone.code": phone.code,
      // "phone.number": phone.number,
      phone,
      ...this.standardQueryMeta,
    });

    if (userRecord?.data?.length === 0)
      return { error: "User with this phone number does not exist" };

    if (!userRecord?.data[0].isPhoneVerified)
      return {
        error: "Verify your phone number to continue.",
      };

    return { error: "", user: userRecord.data[0] };
  }

  async loginUser(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = LoginSchema.validate(body, { abortEarly: false });
      if (error) return this.processValidationsErrors(error);

      const { email: userEmail, password } = request.body;
      const email = userEmail.trim().toLowerCase();

      const result = await this.userController.readRecords({
        email,
        ...this.standardQueryMeta,
      });

      if (result?.data?.length) {
        const userRecord = result.data[0];

        const { error: verifyEmailError } =
          await this.checkIfEmailIsNotVerified(email);

        if (verifyEmailError)
          return this.processFailedResponse(verifyEmailError);

        const isPasswordCorrect = await isMatchingPassword(
          password,
          userRecord.password
        );

        if (isPasswordCorrect) {
          const userToken = generateJwtToken(
            userRecord._id,
            // userRecord.phone,
            userRecord.email
          );
          return this.processSuccessfulResponse({
            user: userRecord,
            token: userToken,
          });
        }
      }

      return this.processFailedResponse("Invalid password or phone");
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

      const existingUser = await this.userController.readRecords({
        _id: request.user._id,
        ...this.standardQueryMeta,
      });

      if (!existingUser?.data?.length)
        return this.processFailedResponse("User not found");
      const userRecord = existingUser.data[0];

      const isPasswordCorrect = await isMatchingPassword(
        password,
        userRecord.password
      );

      if (isPasswordCorrect) {
        const encryptedPassword = await encryptPassword(newPassword);

        const updateUserPassword = await this.userController.updateRecords(
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

  async modifyProfilePicture(request: Request, next: NextFunction) {
    if (request.file) {
      const file = request.file as unknown as S3FileType;
      const updatedUser = await this.userController.updateRecords(
        {
          _id: request.user._id,
        },
        {
          profilePicture: file.location,
        }
      );

      return this.processUpdateResult({
        ...updatedUser,
        message: "Profile picture updated successfully",
      } as IResult);
    }
    return this.processFailedResponse("Please, upload your profile picture");
  }
}

const UserControllerInstance = new Controller<IUserModel>("User");
const TokenControllerInstance = new Controller<ITokenModel>("Token");

export default new UserService(UserControllerInstance, TokenControllerInstance);
