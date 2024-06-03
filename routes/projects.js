import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authProjectMiddleware from '../middleware/authProject.js';
import projectsController from '../controllers/projectsController.js';

const router = express.Router();
const jsonParser = express.json();

router.post('/create', jsonParser, authMiddleware, projectsController.create);
router.post('/join', jsonParser, authMiddleware, projectsController.join);
router.post('/invite', jsonParser, authProjectMiddleware, projectsController.invite);
router.get('/employees', jsonParser, authProjectMiddleware, projectsController.employees);
router.get('/current', jsonParser, authProjectMiddleware, projectsController.current);
router.patch('/role', jsonParser, authProjectMiddleware, projectsController.role);
router.delete('/kick', jsonParser, authProjectMiddleware, projectsController.kick);

export default router;