import Joi from "joi";

export const newProjectSchema = Joi.object({
  name: Joi.string().required(),
})

export const inviteToProjSchema = Joi.object({
  projectId: Joi.string().required(),
  email: Joi.string().email().required(),
})

export const idProjectSchema = Joi.object({
  projectId: Joi.string().required()
})

export const oustFromProjSchema = Joi.object({
  projectId: Joi.string().required(),
  userId: Joi.string().required()
})

export const roleProjectSchema = Joi.object({
  projectId: Joi.string().required(),
  userId: Joi.string().required(),
  role: Joi.string().valid('admin', 'employee', 'view').required()
})