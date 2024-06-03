import Joi from "joi";

export const newProjectSchema = Joi.object({
  name: Joi.string().required(),
})

export const idProjectSchema = Joi.object({
  projectId: Joi.string().required()
})

export const kickFromProjSchema = Joi.object({
  id: Joi.string().required()
})

export const roleProjectSchema = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().valid('admin', 'employee', 'view').required()
})