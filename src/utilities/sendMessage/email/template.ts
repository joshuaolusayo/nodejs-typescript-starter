type TemplateProps = {
  username?: string;
  message: string;
};

export const emailTemplate = ({ username, message }: TemplateProps) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 0; margin: 0; background-color: #f0f0f0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto;">
              <tr>
                  <td>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="background-color: #002EFE; color: #ffffff; text-align: center; padding: 20px;">
                          <tr>
                              <td>
                                  <h1 style="color: #FFBD31; font-size: 24px; margin-bottom: 10px;">Business Name</h1>
                              </td>
                          </tr>
                      </table>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="background-color: #ffffff; padding: 20px;">
                          <tr>
                              <td>
                                  <p style="font-size: 16px;">Dear ${
                                    username || "user"
                                  },</p>
                                  <p style="font-size: 16px;">${message}</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="background-color: #002EFE; color: #ffffff; text-align: center; padding: 20px 0;">
              <tr>
                  <td>
                      <img src="https://res.cloudinary.com/djwa4cx9u/image/upload/v1694792441/364382515_656320169762268_5589206679461502534_n_swgxk9.jpg" alt="Company Logo" style="width: 100px; height: auto;">
                      <p>Business Name</p>
                      <p>Visit our website: <a href="https://www.business.com" style="color: #FFBD31; text-decoration: none;">www.business.com</a></p>
                      <p>Contact us at: <a href="mailto:business@gmail.com" style="color: #FFBD31; text-decoration: none;">info@business.com</a></p>
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `;
};
