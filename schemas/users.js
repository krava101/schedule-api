import Joi from "joi";

export const userRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
})

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
})

export const userVerifyCodeSchema = Joi.object({
  code: Joi.string().min(6).max(6).required()
})

export const userEmailSchema = Joi.object({
  email: Joi.string().email().required()
})