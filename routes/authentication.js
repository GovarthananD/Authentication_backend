import express from "express";
import { User, generateToken } from "../models/usershema.js";
import { getUserByEmail } from "../controllers/userRoute.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendMail.js";
dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const user = await getUserByEmail(req);
    if (!user) {
      return res.status(404).send({ message: "User doesn't exist" });
    }
    let validatePassword = false;
    if (req.body.password == user.password) {
      validatePassword = true;
    }
    console.log(user, req.body, validatePassword);
    if (!validatePassword) {
      return res.status(400).send({ message: "invalid password" });
    }
    const token = generateToken(user._id);
    res.status(200).send({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(400).send({ message: error.message + "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    let user = await getUserByEmail(req);
    if (user) {
      res.status(400).send({ message: "User already exist" });
    }
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      password: req.body.password,
    }).save();
    const token = generateToken(user._id);
    res.status(201).send({ message: "User created successfully", token });
  } catch (error) {
    console.log(error._message);
    res.status(500).send("error").statusMessage = "Not working at all";
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Enter the e-mail" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ message: "User Not Found" });
    }
    let newToken = crypto.randomBytes(32).toString("hex");
    console.log(newToken);
    await User.findOneAndUpdate({ email: email }, { token: newToken });
    const link = `${process.env.SERVER_NAME}/reset?token=${newToken}&id=${user._id}`;
    console.log(link);
    await sendEmail(user.email, "Forgot-Password Link", {
      name: user.name,
      link: link,
    });
    return res
      .status(200)
      .send({ message: "Email has been send to the User Successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message + " Internal Server Error" });
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;
    const resetToken = await User.findOne({ _id: userId });
    if (!resetToken) {
      return res.status(400).send({ message: "Invalid or Expired Token" });
    }
    const isValid = resetToken.token == token;
    if (!isValid) {
      return res.status(400).send({ message: "Invalid Token" });
    }
    // const hashedPassword = await bcrypt.hash(newPassword, 13);
    User.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: newPassword } }
    ).catch((error) => {
      res.status(400).send({ message: "Error while updating user password" });
    });
    // await resetToken.deleteOne();
    return res.status(200).send({ message: "Reset Password Is Successful..." });
  } catch (error) {
    res.status(400).send({ message: "Internal Server Error" });
  }
});

export const userRouter = router;
