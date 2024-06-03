import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import Project from '../models/projects.js';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token!" });
  }

  const [bearer, token] = authHeader.split(' ', 2);
  if (bearer !== 'Bearer') {
    return res.status(401).send({ message: "Invalid token!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token!" });
    }
    try {
      const user = await User.findOne({ _id: decode.id, token });
      if (user === null) {
        return res.status(401).send({ message: "Invalid token!" });
      }
      
      if (typeof decode.projectId === "undefined") {
        return res.status(401).send({ message: "Invalid token!" });
      }

      const project = await Project.findById({ _id: decode.projectId });
      if (project === null) {
        return res.status(401).send({ message: "Invalid token!" });
      }

      const employee = project.employees.find(e => e.id.toString() === user._id.toString());
      if (typeof employee === "undefined") {
        return res.status(401).send({ message: "Invalid token!" });
      }

      req.project = project;
      req.user = user;
      req.userRole = employee.role;
      next();
    } catch (err) {
      next(err);
    }
  })
}

export default auth;