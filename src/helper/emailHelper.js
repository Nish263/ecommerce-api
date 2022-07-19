import nodemailer from "nodemailer";

const emailProcessor = async (emailData) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send email
  let info = await transporter.sendMail(emailData);
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
export const sendMail = async (emailData) => {
  const mailBody = {
    from: '"Laptop store" <danyka86@ethereal.email >', // sender address
    to: "danyka86@ethereal.email ", // list of receivers
    subject: "Please verify your email", // Subject line
    text: `hi there , please follow the link to verify your email ${emailData.url}`, // plain text body
    html: `<p> Hi ${emailData.fname}</p>
        <br/>
        <br/>
        Please follow the link below to verify your emailData, so that you can login to your account.
        <br/>
        <br/>
        <a href="${emailData.url}">${emailData.url}<a/>
        <br/>
        <br/>
        kind regards,
        laptop store team 
         `, // html body
  };
};

// /userInfo should have email
export const OtpNotificationMail = async (userInfo) => {
  const mailBody = {
    from: '"Laptop store" <talia.towne63@ethereal.email>', // sender address
    to: userInfo.email, // list of receivers
    subject: "You have received OTP", // Subject line
    text: `hi there , here is the OTP as per your request ${userInfo.token}`, // plain text body
    html: `<p> Hi There</p>
        <br/>
        <br/>
        here is the OTP as per your request ${userInfo.token}
        <br/>
        

        kind regards,
        laptop store team
         `, // html body
  };
  emailProcessor(mailBody);
};

export const profileUpdateNotificationMail = async (emailData) => {
  const mailBody = {
    from: '"Laptop store" <talia.towne63@ethereal.email>', // sender address
    to: emailData.email, // list of receivers
    subject: "Please update notification", // Subject line
    text: `hi there , your profile just updated, If it wasn't you please contact immediately`, // plain text body
    html: `<p> Hi ${emailData.fname}</p>
        <br/>
        <br/>
        your profile just updated, If it wasn't you please contact immediately
        <br/>
        <br/>
        

        kind regards,
        laptop store team
         `, // html body
  };
};
