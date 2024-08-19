/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { AdminRole } from "@/constants/enums";
import Joi from "joi";

const RequiredPhone = {
  phone: Joi.string()
    .pattern(new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
    .required()
    .messages({
      "string.pattern.base": "Invalid phone number format",
      "any.required": "Phone number is required",
    }),
};

const RequiredEmail = {
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
};

const RequiredPassword = {
  password: Joi.string().required().min(6),
  // .pattern(
  //   /^(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and have a total length of 8 characters or more"
  // ),
};

const RequiredOtp = {
  otp: Joi.string().length(6).required(),
};

const RequiredGender = {
  gender: Joi.string().required(),
};

const RequiredDateOfBirth = {
  dateOfBirth: Joi.date()
    .max(`${new Date().getFullYear() - 18}-12-31`) // Ensures the year is at least 18 years ago
    .messages({
      "date.max": "You must be at least 18 years old",
    })
    .required(),
};

const RequiredFullName = {
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
};

export const AuthSchema = Joi.object({
  ...RequiredPhone,
  ...RequiredPassword,
});

export const LoginSchema = Joi.object({
  ...RequiredEmail,
  ...RequiredPassword,
});

export const AdminResetPasswordSchema = Joi.object({
  ...RequiredEmail,
  ...RequiredPassword,
  ...RequiredOtp,
});

export const PhoneNumberSchema = Joi.object({
  ...RequiredPhone,
});

export const EmailSchema = Joi.object({
  ...RequiredEmail,
});

export const VerifyPhoneOtpSchema = Joi.object({
  ...RequiredPhone,
  ...RequiredOtp,
});

export const VerifyEmailOtpSchema = Joi.object({
  ...RequiredEmail,
  ...RequiredOtp,
});

export const SetPasswordSchema = Joi.object({
  ...RequiredPhone,
  ...RequiredPassword,
});

export const ChangePasswordSchema = Joi.object({
  password: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  // .pattern(
  //   /^(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and have a total length of 8 characters or more"
  // )
});

export const ResetPasswordSchema = Joi.object({
  ...RequiredEmail,
  ...RequiredPassword,
  ...RequiredOtp,
});

export const AdminSignupSchema = Joi.object({
  ...RequiredEmail,
  ...RequiredPhone,
  ...RequiredFullName,
  role: Joi.string().valid(...Object.values(AdminRole)),
});

export const UserSignupSchema = Joi.object({
  ...RequiredEmail,
  // ...RequiredPhone,
  ...RequiredFullName,
  ...RequiredPassword,
  ...RequiredGender,
  ...RequiredDateOfBirth,
  // role: Joi.string().valid(...Object.keys(AdminRole)),
});

export const TherapistSignupSchema = Joi.object({
  ...RequiredEmail,
  // ...RequiredPhone,
  ...RequiredFullName,
  ...RequiredGender,
  reasonForJoining: Joi.string().required(),
  // ...RequiredPassword,
  // role: Joi.string().valid(...Object.keys(AdminRole)),
});

export const TherapistSignupByAdminSchema = Joi.object({
  ...RequiredEmail,
  // ...RequiredPhone,
  ...RequiredFullName,
  ...RequiredGender,
  // reasonForJoining: Joi.string().required(),
  // ...RequiredPassword,
  // role: Joi.string().valid(...Object.keys(AdminRole)),
});

export const VerifyTherapistSchema = Joi.object({
  userId: Joi.string().hex().length(24),
});

export const UserIdSchema = Joi.object({
  id: Joi.string().hex().length(24),
});

export const UpdateProfileSchema = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  phone: Joi.string(),
  gender: Joi.string(),
  dateOfBirth: Joi.date()
    .max(`${new Date().getFullYear() - 18}-12-31`) // Ensures the year is at least 18 years ago
    .messages({
      "date.max": "You must be at least 18 years old",
    }),
  state: Joi.string(),
});

export const UpdateAdminSchema = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  phone: Joi.string(),
});
