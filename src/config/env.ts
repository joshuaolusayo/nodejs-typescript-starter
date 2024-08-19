/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import throwIfUndefined from "./throwIfUndefined";
import "dotenv/config";

const Environment = {
  PORT: process.env.PORT || "5000",
  IP: process.env.IP || "0.0.0.0",
  NODE_ENV: process.env.NODE_ENVIRONMENT || "development",
  JWT_SECRET: throwIfUndefined("JWT Secret", process.env.JWT_SECRET),
  JWT_ISSUER: process.env.JWT_ISSUER || "us-therapy.com",
  DB_URI: throwIfUndefined("Database URI", process.env.DB_URI),
  SENDGRID_API_KEY: throwIfUndefined(
    "Sendgrid API Key",
    process.env.SENDGRID_API_KEY
  ),
  FRONTEND_URL: throwIfUndefined("Frontend URL", process.env.FRONTEND_URL),
  STRIPE_SECRET_KEY: throwIfUndefined(
    "Striple Secret Key",
    process.env.STRIPE_SECRET_KEY
  ),
  STRIPE_PUBLISHABLE_KEY: throwIfUndefined(
    "Striple Publishable Key",
    process.env.STRIPE_PUBLISHABLE_KEY
  ),
  STRIPE_WEBHOOK_SECRET: throwIfUndefined(
    "Striple Webhook Secret",
    process.env.STRIPE_WEBHOOK_SECRET
  ),
  NODEMAILER_EMAIL_USERNAME: process.env.NODEMAILER_EMAIL_USERNAME || "",
  NODEMAILER_EMAIL_PASSWORD: process.env.NODEMAILER_EMAIL_PASSWORD || "",
  SENDCHAMP_ACCESS_KEY: process.env.SENDCHAMP_ACCESS_KEY || "",
  SENDCHAMP_ACCESS_URL: process.env.SENDCHAMP_ACCESS_URL || "",
  NODEMAILER_OAUTH_CLIENT_ID: process.env.NODEMAILER_OAUTH_CLIENT_ID || "",
  NODEMAILER_OAUTH_CLIENT_SECRET:
    process.env.NODEMAILER_OAUTH_CLIENT_SECRET || "",
  NODEMAILER_ACCESS_TOKEN: process.env.NODEMAILER_ACCESS_TOKEN || "",
  NODEMAILER_REFRESH_TOKEN: process.env.NODEMAILER_REFRESH_TOKEN || "",
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || "",
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || "",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
  AWS_REGION: process.env.AWS_REGION || "us-west-2",
  AWS_URL: process.env.AWS_URL || "",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_NUMBER: process.env.TWILIO_NUMBER || "",
  AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
  AZURE_STORAGE_DEFAULT_CONTAINER:
    process.env.AZURE_STORAGE_DEFAULT_CONTAINER || "",
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || "",
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || "",
  // SENDCHAMP_ACCESS_KEY: throwIfUndefined(
  //   "SendChamp Access Key",
  //   process.env.SENDCHAMP_ACCESS_KEY
  // ),
  // SENDCHAMP_ACCESS_URL: throwIfUndefined(
  //   "SendChamp Access Url",
  //   process.env.SENDCHAMP_ACCESS_URL
  // ),
  // NODEMAILER_EMAIL_USERNAME: throwIfUndefined(
  //   "Nodemailer Email Username",
  //   process.env.NODEMAILER_EMAIL_USERNAME
  // ),
  // NODEMAILER_EMAIL_PASSWORD: throwIfUndefined(
  //   "Nodemailer Email Password",
  //   process.env.NODEMAILER_EMAIL_PASSWORD
  // ),
  // NODEMAILER_OAUTH_CLIENT_ID: throwIfUndefined(
  //   "Nodemailer Oauth Client ID",
  //   process.env.NODEMAILER_OAUTH_CLIENT_ID
  // ),
  // NODEMAILER_OAUTH_CLIENT_SECRET: throwIfUndefined(
  //   "Nodemailer OAuth Client Secret",
  //   process.env.NODEMAILER_OAUTH_CLIENT_SECRET
  // ),
  // NODEMAILER_ACCESS_TOKEN: throwIfUndefined(
  //   "Nodemailer Access Token",
  //   process.env.NODEMAILER_ACCESS_TOKEN
  // ),
  // NODEMAILER_REFRESH_TOKEN: throwIfUndefined(
  //   "Nodemailer Email Username",
  //   process.env.NODEMAILER_REFRESH_TOKEN
  // ),
  // AWS_ACCESS_KEY: throwIfUndefined(
  //   "AWS Access Key",
  //   process.env.AWS_ACCESS_KEY
  // ),
  // AWS_SECRET_KEY: throwIfUndefined(
  //   "AWS Secret Key",
  //   process.env.AWS_SECRET_KEY
  // ),
  // AWS_BUCKET_NAME: throwIfUndefined(
  //   "AWS Bucket Name",
  //   process.env.AWS_BUCKET_NAME
  // ),
  // AWS_REGION: throwIfUndefined("AWS Region", process.env.AWS_REGION),
  // AWS_URL: throwIfUndefined("AWS URL", process.env.AWS_URL),
  // TWILIO_ACCOUNT_SID: throwIfUndefined(
  //   "Twilio Account SID",
  //   process.env.TWILIO_ACCOUNT_SID
  // ),
  // TWILIO_AUTH_TOKEN: throwIfUndefined(
  //   "Twilio Account Token",
  //   process.env.TWILIO_AUTH_TOKEN
  // ),
  // TWILIO_NUMBER: throwIfUndefined(
  //   "Twilio Phone Number",
  //   process.env.TWILIO_NUMBER
  // ),
  // AZURE_STORAGE_ACCOUNT_NAME: throwIfUndefined(
  //   "Azure Storage Account Name",
  //   process.env.AZURE_STORAGE_ACCOUNT_NAME
  // ),
  // AZURE_STORAGE_DEFAULT_CONTAINER:
  //   process.env.AZURE_STORAGE_DEFAULT_CONTAINER || "general",
  // PAYSTACK_SECRET_KEY: throwIfUndefined(
  //   "Paystack Secret Key",
  //   process.env.PAYSTACK_SECRET_KEY
  // ),
  // PAYSTACK_PUBLIC_KEY: throwIfUndefined(
  //   "Paystack Public Key",
  //   process.env.PAYSTACK_PUBLIC_KEY
  // ),
};

export default Environment;
