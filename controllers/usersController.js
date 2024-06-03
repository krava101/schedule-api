import User from '../models/users.js';
import Project from '../models/projects.js';

async function current(req, res, next) {
  const user = req.user;
  return res.status(200).send({ id: user._id, name: user.name, email: user.email });
}

async function acceptInvite(req, res, next) {
  const { projectId, accept } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (project === null) {
      return res.status(404).send({ message: "Project not found!" });
    }
    const invites = req.user.invites.filter(e => e.projectId.toString() !== projectId);
    const user = await User.findByIdAndUpdate(req.user._id, { invites }, { new: true });

    if (!accept) {
      return res.status(200).send({ message: "Invition declined!" });
    }
    const employees = [...project.employees, { id: user._id, name: user.name, email: user.email }];
    await Project.findByIdAndUpdate(project._id, { employees });

    const projects = [...user.projects, { projectId: project._id, projectName: project.name }];
    await User.findByIdAndUpdate(user._id, { projects });

    return res.status(200).send({ message: "Invition accepted!" });
  } catch (err) {
    next(err);
  }
}

async function rename(req, res, next) {
  const user = req.user;
  try {
    
  } catch (err) {
    next(err);
  }
}

export default { current, acceptInvite, rename }