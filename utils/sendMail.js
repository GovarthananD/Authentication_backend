import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (email, subject, payload) => {
  console.log("Sending Email...");
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });
    console.log(payload);
    console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    let mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: subject,
      html: `<a href="${payload.link}">Click here to reset password</a>`,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error in sending mail");
        console.log(err);
        return false;
      }
      res.status(200).send({ message: "Email Send Successfully" });
    });
  } catch (error) {
    res.statuts(400).send({ message: "Something error", error });
  }
};
