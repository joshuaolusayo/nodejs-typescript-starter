/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import sendEmail, { MailConfigProps } from "@/utilities/sendMessage/email";
import { createSendgridMailConfig } from "@/utilities/sendMessage/email/sendgrid";
// import sendSMS from "@/utilities/sendMessage/sms";

const sendUserSMS = async (phone_number: string, message: string) => {
  try {
    // await sendSMS(message, phone_number);
  } catch (error) {
    console.log({ error });
  }
};

const sendUserEmail = async (messageConfig: MailConfigProps) => {
  try {
    const { subject, recipientEmail, message, preHeader = "" } = messageConfig;
    const config = createSendgridMailConfig(
      subject,
      recipientEmail,
      message,
      preHeader
    );
    await sendEmail(config); // use messageConfig if the email to be used is nodemailer
  } catch (error) {
    console.log({ error });
  }
};

export { sendUserSMS, sendUserEmail };
