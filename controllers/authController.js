import User from '../models/users.js';
import bcrypt from 'bcrypt';
import { userRegisterSchema, userLoginSchema, userVerifyCodeSchema, userEmailSchema } from '../schemas/users.js';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import mail from '../mail.js';

async function register(req, res, next) {
  const userValid = userRegisterSchema.validate(req.body);
  const { name, email, password } = req.body;
  if (userValid.error) {
    return res.status(400).send({message: userValid.error.details[0].message });
  }
  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User already registrered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = Math.floor(Math.random() * 900000) + 100000;
    await User.create({ name, email, password: passwordHash, verifyToken });

    mail.sendMail({
      to: email,
      from: process.env.SENDERS_EMAIL,
      subject: "Welcome to Phonebook!",
      html: `<h1>Confirmation code: ${verifyToken}</h1>`,
      text: `Confirmation code: ${verifyToken}`
    })

    return res.status(201).send({ message: `We sent a mail for verification on ${email}`});
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next){
  const userValid = userLoginSchema.validate(req.body);
  const { email, password } = req.body;
  if (userValid.error) {
    return res.status(400).send({message: userValid.error.details[0].message });
  }
  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).send({ message: "Email or password is incorrect!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Email or password is incorrect!" });
    }
    if (!user.verify) {
      return res.status(403).send({ message: "Account is not verified!" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(user._id, { token });

    return res.status(200).send({ token, user: {id: user._id, name: user.name, email } });
  } catch (err) {
    next(err);
  }
}

async function current(req, res, next){
  try {
    const user = await User.findById(req.user._id);
    if (user === null) {
      return res.status(404).send({ message: "User not found!" });
    }
    res.status(200).send({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next){
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function verify(req, res, next){
  const codeValid = userVerifyCodeSchema.validate(req.body);
  const { code } = req.body;
  if (codeValid.error) {
    return res.status(400).send({message: codeValid.error.details[0].message });
  }
  try {
    const user = await User.findOne({ verifyToken: code });
    if (user === null) {
      return res.status(404).send({ message: "User not found!" });
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });
    return res.status(200).send({ message: "Verification successful!" });
  } catch (err) {
    next(err);
  }
}

async function resendCode(req, res, next) {
  const emailValid = userEmailSchema.validate(req.body);
  const { email } = req.body;
  if (emailValid.error) {
    return res.status(400).send({message: emailValid.error.details[0].message });
  }
  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(404).send({ message: "User not found!" });
    }
    if (user.verify) {
      return res.status(400).send({ message: "Verification has already been passed" });
    }

    const verifyToken = Math.floor(Math.random() * 900000) + 100000;
    await User.findByIdAndUpdate(user._id, { verifyToken });

    mail.sendMail({
      to: email,
      from: process.env.SENDERS_EMAIL,
      subject: "Welcome to Phonebook!",
      html: `<h1>Confirmation code: ${verifyToken}</h1>`,
      text: `Confirmation code: ${verifyToken}`
    })

    return res.status(201).send({ message: `We resend a mail for verification on ${email}`});
  } catch (err) {
    next(err);
  }
}

export default { register, login, current, logout, verify, resendCode };