import Project from '../models/projects.js';
import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import { idProjectSchema, kickFromProjSchema, newProjectSchema, roleProjectSchema } from '../schemas/projects.js';
import { userEmailSchema } from '../schemas/users.js';

async function create(req, res, next) {
  const projectValid = newProjectSchema.validate(req.body);
  const { name } = req.body;
  const owner = req.user;
  if (projectValid.error) {
    return res.status(400).send({message: projectValid.error.details[0].message });
  }
  try {
    const project = await Project.create({
      name,
      owner: { id: owner._id, name: owner.name, email: owner.email },
      employees: [{ id: owner._id, role: "creator", name: owner.name, email: owner.email }]
    });

    const ownProjects = [...owner.ownProjects, { projectId: project._id, projectName: project.name }];
    await User.findByIdAndUpdate(owner._id, { ownProjects });

    return res.status(201).send({id: project._id, name: project.name, owner: project.owner});
  } catch (err) {
    next(err);
  }
}

async function join(req, res, next) {
  const projectIdValid = idProjectSchema.validate(req.body);
  const { projectId } = req.body;
  const user = req.user;
  if (projectIdValid.error) {
    return res.status(400).send({message: projectIdValid.error.details[0].message });
  }
  try {
    const project = await Project.findById(projectId);
    if (project === null) {
      return res.status(404).send({ message: "Project not found!" });
    }
    const employee = project.employees.find(e => e.id.toString() === user._id.toString());
    if (typeof employee === "undefined") {
      return res.status(404).send({ message: "User does not have access!" });
    }
    const token = jwt.sign({ id: user._id, email: user.email, projectId: project._id }, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(user._id, { token });
    return res.status(200).send({
      token,
      project: {
        id: project._id,
        name: project.name,
        owner: project.owner,
        employees: project.employees,
      }
    });
  } catch (err) {
    next(err);
  }
}

async function invite(req, res, next) {
  const emailValid = userEmailSchema.validate(req.body);
  const { email } = req.body;
  const project = req.project;
  const projectId = project._id;
  if (emailValid.error) {
    return res.status(400).send({message: emailValid.error.details[0].message });
  }
  try {
    const employee = project.employees.find(e => e.id.toString() === req.user._id.toString());
    if (employee.role === "employee" || employee.role === "view") {
      return res.status(403).send({ message: "User does not have access!" });
    }

    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(404).send({ message: "User not found!" });
    }

    const isJoined = project.employees.find(e => e.email === email);
    if (typeof isJoined !== "undefined") {
      return res.status(409).send({ message: "User is already joined!" });
    }

    const invite = user.invites.find(e => e.projectId.toString() === projectId.toString());
    if (typeof invite !== "undefined") {
      return res.status(400).send({ message: "The invite has already been sent!" });
    }

    const currentInvites = user.invites;
    await User.findByIdAndUpdate(user._id, {
      invites: [
        ...currentInvites,
        {
          projectId,
          projectName: project.name,
        }]
    });
    return res.status(200).send({ message: `An invite has been sent to the user with an email ${email}` });
  } catch (err) {
    next(err);
  }
}

async function current(req, res, next) {
  const project = req.project;
  return res.status(200).send({
    id: project._id,
    name: project.name,
    owner: project.owner,
    employees: project.employees,
  });
}

async function employees(req, res, next) {
  const projectId = req.project._id;
  const user = req.user;
  const role = req.userRole;
  const project = req.project;
  try {
    if (role === "creator" || role === "admin") {
      return res.status(200).send({ employees: project.employees });
    }
    const employee = project.employees.find(e => e.id.toString() === user._id.toString());
    return res.status(200).send({ employees: [ employee ] });
  } catch (err) {
    next(err);
  }
}

async function kick(req, res, next) {
  const userValid = kickFromProjSchema.validate(req.body);
  const { id } = req.body;
  const project = req.project;
  const userRole = req.userRole;
  if (userValid.error) {
    return res.status(400).send({message: userValid.error.details[0].message });
  }
  try {
    const employee = project.employees.find(e => e.id.toString() === id);
    if (typeof employee === "undefined") {
      return res.status(404).send({ message: "User not found!" });
    }
    if (employee.role === "creator") {
      return res.status(403).send({ message: "User does not have access!" });
    }
    if (userRole === "employee" || userRole === "view") {
      return res.status(403).send({ message: "User does not have access!" });
    }

    const employees = project.employees.filter(e => e.id.toString() !== employee.id.toString());
    await Project.findByIdAndUpdate(project._id, { employees });

    return res.status(200).send({ employees });
  } catch (err) {
    next(err);
  }
}

async function role(req, res, next) {
  const roleValid = roleProjectSchema.validate(req.body);
  const { id, role } = req.body;
  const userRole = req.userRole;
  const project = req.project;
  if (roleValid.error) {
    return res.status(400).send({message: roleValid.error.details[0].message });
  }
  try {
    const employee = project.employees.find(e => e.id.toString() === id);
    if (typeof employee === "undefined") {
      return res.status(404).send({ message: "User not found!" });
    }
    if (employee.role === "creator") {
      return res.status(403).send({ message: "User does not have access!" });
    }
    if (userRole === "employee" || userRole === "view") {
      return res.status(403).send({ message: "User does not have access!" });
    }

    const employees = project.employees.filter(e => e.id.toString() === employee.id.toString() ? e.role = role : e);
    await Project.findByIdAndUpdate(project._id, { employees });
    
    const updEmployee = project.employees.find(e => e.id.toString() === employee.id.toString());
    return res.status(200).send(updEmployee);
  } catch (err) {
    next(err);
  }
}

export default { create, join, invite, employees, current, kick, role };