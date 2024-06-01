import Project from '../models/projects.js';
import User from '../models/users.js';
import { idProjectSchema, inviteToProjSchema, newProjectSchema, oustFromProjSchema, roleProjectSchema } from '../schemas/projects.js';

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

async function invite(req, res, next) {
  const inviteValid = inviteToProjSchema.validate(req.body);
  const { projectId, email } = req.body;
  if (inviteValid.error) {
    return res.status(400).send({message: inviteValid.error.details[0].message });
  }
  try {
    const project = await Project.findById(projectId);
    if (project === null) {
      return res.status(404).send({ message: "Project not found!" });
    }

    const isEmployee = project.employees.find(e => e.id.toString() === req.user._id.toString());
    if (typeof isEmployee === "undefined") {
      return res.status(403).send({ message: "User does not have access!" });
    }
    if (isEmployee.role === "employee" || isEmployee.role === "view") {
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

    const invite = user.invites.find(e => e.projectId.toString() === projectId);
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

async function employees(req, res, next) {
  const projectIdValid = idProjectSchema.validate(req.body);
  const { projectId } = req.body;
  if (projectIdValid.error) {
    return res.status(400).send({message: projectIdValid.error.details[0].message });
  }
  try {
    const project = await Project.findById(projectId);
    if (project === null) {
      return res.status(404).send({ message: "Project not found!" });
    }
    return res.status(200).send({ employees: project.employees });
  } catch (err) {
    next(err);
  }
}

async function current(req, res, next) {
  const projectIdValid = idProjectSchema.validate(req.body);
  const { projectId } = req.body;
  if (projectIdValid.error) {
    return res.status(400).send({message: projectIdValid.error.details[0].message });
  }
  try {
    const project = await Project.findById(projectId);
    if (project === null) {
      return res.status(404).send({ message: "Project not found!" });
    }
    return res.status(200).send({
      id: project._id,
      name: project.name,
      owner: project.owner,
      employees: project.employees,
    });
  } catch (err) {
    next(err);
  }
}

async function oust(req, res, next) {
  const userValid = oustFromProjSchema.validate(req.body);
  const { projectId, userId } = req.body;
  if (userValid.error) {
    return res.status(400).send({message: userValid.error.details[0].message });
  }
  try {
    const project = await Project.findById(projectId);
    if (project === null) {
      return res.status(404).send({ message: "Project not found!" });
    }
    const user = project.employees.find(e => e.id.toString() === userId);
    if (typeof user === "undefined") {
      return res.status(404).send({ message: "User not found!" });
    }

    const isEmployee = project.employees.find(e => e.id.toString() === req.user._id.toString());
    if (user.role === "creator") {
      return res.status(403).send({ message: "User does not have access!" });
    }
    if (typeof isEmployee === "undefined") {
      return res.status(403).send({ message: "User does not have access!" });
    }
    if (isEmployee.role === "employee" || isEmployee.role === "view") {
      return res.status(403).send({ message: "User does not have access!" });
    }


    const employees = project.employees.filter(e => e.id.toString() !== userId);
    await Project.findByIdAndUpdate(project._id, {employees})
    return res.status(200).send({ employees });
  } catch (err) {
    next(err);
  }
}

async function role(req, res, next) {
  const roleValid = roleProjectSchema.validate(req.body);
  const { projectId, userId, role } = req.body;
  if (roleValid.error) {
    return res.status(400).send({message: roleValid.error.details[0].message });
  }
  try {
    const project = await Project.findById(projectId);
    if (project === null) {
      return res.status(404).send({ message: "Project not found!" });
    }
    const user = project.employees.find(e => e.id.toString() === userId);
    if (typeof user === "undefined") {
      return res.status(404).send({ message: "User not found!" });
    }

    const isEmployee = project.employees.find(e => e.id.toString() === req.user._id.toString());
    if (user.role === "creator") {
      return res.status(403).send({ message: "User does not have access!" });
    }
    if (typeof isEmployee === "undefined") {
      return res.status(403).send({ message: "User does not have access!" });
    }
    if (isEmployee.role === "employee" || isEmployee.role === "view") {
      return res.status(403).send({ message: "User does not have access!" });
    }

    const employees = project.employees.filter(e => e.id.toString() === userId ? e.role = role : e);
    const newRoleUser = project.employees.find(e => e.id.toString() === userId);
    await Project.findByIdAndUpdate(projectId, { employees });

    return res.status(200).send(newRoleUser);
  } catch (err) {
    next(err);
  }
}

export default { create, invite, employees, current, oust, role };