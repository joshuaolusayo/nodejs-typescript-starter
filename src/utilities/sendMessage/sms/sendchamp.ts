import Environment from "@/config/env";
import { sendData } from "@/utilities/axios";

const { SENDCHAMP_ACCESS_KEY, SENDCHAMP_ACCESS_URL } = Environment;

const customHeaders = {
  Authorization: `Bearer ${SENDCHAMP_ACCESS_KEY}`,
  "Content-Type": "application/json",
};

const sendSMS = async (message_body: string, recipient_number: string) => {
  const response = await sendData(
    `${SENDCHAMP_ACCESS_URL}/sms/send`,
    "POST",
    {
      to: recipient_number,
      message: message_body,
      sender_name: "Sender Name",
      route: "non_dnd",
    },
    customHeaders
  );

  console.log({ response });

  if (response instanceof Error) {
    console.error("SMS sending failed:", response.message);
    return;
  }

  console.log("SMS Response data:", response.data);
};

export { sendSMS };
