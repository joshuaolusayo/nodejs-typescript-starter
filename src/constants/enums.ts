/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

export enum AdminRole {
  ADMIN = "admin",
  // EDITOR = "EDITOR",
  SUPERADMIN = "superadmin",
}

export enum VERIFICATION_TYPE {
  PhoneVerification = "phone verification",
  ResetPassword = "reset password",
  ResetTherapistPassword = "reset therapist password",
  ResetAdminPassword = "reset admin password",
  EmailVerification = "email verification",
  AdminEmailVerification = "admin email verification",
}

export enum CURRENCY_TYPE {
  NAIRA = "NGN",
  DOLLAR = "USD",
}
