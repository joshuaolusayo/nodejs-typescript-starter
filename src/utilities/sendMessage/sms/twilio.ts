// import Environment from "@/config/env";
// import twilio from "twilio";

// const twilio_client = twilio(
//   Environment.TWILIO_ACCOUNT_SID,
//   Environment.TWILIO_AUTH_TOKEN
// );

// const sendSMS = async (message_body: string, recipient_number: string) => {
//   try {
//     await twilio_client.messages.create({
//       body: message_body,
//       to: recipient_number.startsWith("+")
//         ? recipient_number
//         : "+" + recipient_number.toString(),
//       from: Environment.TWILIO_NUMBER,
//     });
//   } catch (error) {
//     // fallback code here
//     console.error(error);
//   }
// };

// export { sendSMS };
