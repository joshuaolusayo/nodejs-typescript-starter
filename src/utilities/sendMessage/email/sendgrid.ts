// import Environment from "@/config/env";
import Environment from "@/config/env";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(Environment.SENDGRID_API_KEY);

type SendgridMailConfigProps = {
  to: string;
  from: {
    name: string;
    email: string;
  };
  subject: string;
  html: string;
};

const createSendgridMailConfig = (
  subject: string,
  recipientEmail: string,
  message: string,
  preHeader: string
) => {
  const preheader = `<span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">${preHeader}</span>`;
  return {
    to: recipientEmail,
    from: { name: "Sender", email: "sender@email.com" },
    subject,
    html: `${preheader}${message}`,
  };
};

const sendEmail = async (messageConfig: SendgridMailConfigProps) => {
  try {
    await sendgrid.send(messageConfig);
    console.log("message sent to", messageConfig.to);
  } catch (error) {
    console.log({ error });
  }
};

export { createSendgridMailConfig, sendgrid, sendEmail };
