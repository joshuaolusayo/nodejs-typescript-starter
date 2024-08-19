import Environment from "@/config/env";
import nodemailer, { TransportOptions } from "nodemailer";
import { emailTemplate } from "./template";
import { MailConfigProps } from "./type";

// SETUP DOC: https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/

const { NODEMAILER_EMAIL_USERNAME = "", NODEMAILER_EMAIL_PASSWORD = "" } =
  Environment;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_EMAIL_USERNAME,
    pass: NODEMAILER_EMAIL_PASSWORD,
  },
} as TransportOptions);

const createMailConfig = ({
  subject,
  recipientEmail,
  message,
  preHeader,
  username,
}: MailConfigProps) => {
  return {
    to: recipientEmail,
    from: "sender@email.com",
    subject,
    html: emailTemplate({ message, username }),
    text: preHeader,
  };
};

const sendEmail = async (messageConfig: MailConfigProps) => {
  const mail_options = createMailConfig(messageConfig);
  try {
    await transporter.sendMail(mail_options);
    // console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

export { sendEmail };
