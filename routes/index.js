import express from 'express';
import auth from './auth.js';
import projects from './projects.js';
import users from './users.js';
import authMiddleware from '../middleware/auth.js';
import authProjectMiddleware from '../middleware/authProject.js';

const router = express.Router();

router.use('/api/auth', auth);
router.use('/api/projects', projects);
router.use('/api/users', authMiddleware, users);


export default router;