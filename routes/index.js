import express from 'express';
import auth from './auth.js';
import projects from './projects.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use('/api/auth', auth);
router.use('/api/projects', authMiddleware, projects);


export default router;