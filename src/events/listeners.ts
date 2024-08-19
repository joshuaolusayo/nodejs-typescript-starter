/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { MailConfigProps } from "@/utilities/sendMessage/email";
import appEvent from "./_index";
import ALL_EVENTS from "./allEvents";
import { sendUserEmail, sendUserSMS } from "./handler";

type NewOtpProps = {
  phoneNumber: string;
  message: string;
};

appEvent.on(ALL_EVENTS.sendSMS, async (payload: NewOtpProps) => {
  const { message, phoneNumber } = payload;
  await sendUserSMS(phoneNumber, message);
});

appEvent.on(ALL_EVENTS.sendEmail, async (payload: MailConfigProps) => {
  await sendUserEmail(payload);
});
