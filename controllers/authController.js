import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import { userModel } from "../models/userModel.js";
import joi from "joi";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import verifyModel from "../models/verifyModel.js";

//POST REGISTER
export const registerController = async (req, res) => {
  try {
    // user fields check
    const userSchema = joi.object({
      name: joi
        .string()
        .pattern(new RegExp("^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,30}$"))
        .required(),
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "ru", "az"] } })
        .required(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{8,30}$"))
        .required(),
      phone: joi.string().pattern(new RegExp("^[0-9]{9}$")).required(),
      address: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9,./ əöğıüçşƏÖĞIÜÇŞ]{3,50}$")),
    });
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }
    const userExist = await userModel.findOne({ email: value.email });
    //check user
    if (userExist) {
      return res.status(403).send("Already register, please login!");
    }
    //register user  => password hash
    const hashedPassword = await hashPassword(value.password);
    const newUser = await userModel.create({
      ...value,
      password: hashedPassword,
    });
    return res.status(201).send({
      success: true,
      message: "User register successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in registration", error: error.message });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const userSchema = joi.object({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "ru", "az"] } })
        .required(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{3,30}$"))
        .required(),
    });
    const {
      error,
      value: { email, password },
    } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res
        .status(404)
        .send({ success: false, message: "email not found" });
    }
    const hashPassRight = await comparePassword(password, userExist.password);
    if (!hashPassRight) {
      return res
        .status(401)
        .send({ succes: false, message: "password is wrong!" });
    }
    const token = jwt.sign({ email: userExist.email, role: userExist.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).send({
      succes: true,
      message: "login successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in login", error: error.message });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const userSchema = joi.object({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "ru", "az"] } })
        .required(),
    });
    const {
      error,
      value: { email },
    } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ success: false, message: error.message });
    }
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res.status(404).send("Email not found");
    }
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "quliyevnamiq8@gmail.com",
        pass: "cuvommenedjjruas",
      },
    });
    const verifyCode = Math.floor(Math.random() * 1000000);
    await verifyModel.create({ verifyCode, email: userExist.email });
    let details = {
      from: "quliyevnamiq8@gmail.com",
      to: `${email}`,
      subject: "user verify Code",
      text: `Verify Code : ${verifyCode}`,
    };
    mailTransporter.sendMail(details, (err) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      return res.status(200).send({
        success: true,
        message: "The information has been sent to your email address",
      });
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in forgot Password", error: error.message });
  }
};

// verify code

export const verifyController = async (req, res) => {
  try {
    const { verifyCode } = req.body;
    const check_confirmation = await verifyModel.findOne({ verifyCode });
    if (!check_confirmation) {
      return res
        .status(401)
        .send({ success: false, message: "verify code is wrong!" });
    }
    const token = jwt.sign(
      { email: check_confirmation.email },
      process.env.JWT_SECRET
    );
    return res.status(200).send({
      success: true,
      message: "verify code is correct",
      token: `${token}`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in verify", error: error.message });
  }
};

// password recovery

export const recoveryController = (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res
        .status(400)
        .send({ success: false, message: "Token is invalid" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, forget) => {
      if (err) {
        return res
          .status(401)
          .send({ success: false, message: "Token is wrong" });
      }
      const userSchema = joi.object({
        new_password: joi
          .string()
          .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{3,30}$"))
          .required(),
        repeat_password: joi.string().equal(joi.ref("new_password")).required(),
      });
      const { error, value } = userSchema.validate(req.body);
      if (error) {
        return res.status(401).send({ success: false, message: error.message });
      }
      const hashPass = await hashPassword(value.new_password);
      const updatePassword = await userModel.findOneAndUpdate(
        { email: forget.email },
        { $set: { password: hashPass } }
      );
      return res.status(200).send({
        success: true,
        message: "Your password is updated",
        user: updatePassword
      });
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in recovery", error: error.message });
  }
};
