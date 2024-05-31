import nodemailer from 'nodemailer';

const USERNAME = process.env.MAILTRAP_USERNAME;
const PASSWORD = process.env.MAILTRAP_PASSWORD;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: USERNAME,
    pass: PASSWORD
  }
})

function sendMail(message) {
  return transport.sendMail(message, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

export default { sendMail };