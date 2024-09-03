/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

export enum AdminRole {
  ADMIN = "admin",
  // EDITOR = "EDITOR",
  SUPERADMIN = "superadmin",
}

export enum VERIFICATION_TYPE {
  PHONE_VERIFICATION = "phone_verification",
  RESET_PASSWORD = "reset_password",
  RESET_ADMIN_PASSWORD = "reset_admin_password",
  EMAIL_VERIFICATION = "email_verification",
  ADMIN_EMAIL_VERIFICATION = "admin_email_verification",
}

export enum CURRENCY_TYPE {
  NAIRA = "NGN",
  DOLLAR = "USD",
}
