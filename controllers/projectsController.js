import Project from '../models/projects.js';

async function create(req, res, next) {
  const { name } = req.body;
  const owner = req.user;
  try {
    const project = await Project.create({ name, owner: { id: owner._id }, employees: [{ id: owner._id, role: "creator" }] });
    res.status(201).send(project);
  } catch (err) {
    next(err);
  }
}

export default { create };