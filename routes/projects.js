import express from 'express';
import projectsController from '../controllers/projectsController.js';

const router = express.Router();
const jsonParser = express.json();

router.post('/create', jsonParser, projectsController.create);
router.post('/invite', jsonParser, projectsController.invite);
router.get('/employees', jsonParser, projectsController.employees);
router.get('/current', jsonParser, projectsController.current);
router.patch('/role', jsonParser, projectsController.role);
router.delete('/oust', jsonParser, projectsController.oust);

export default router;