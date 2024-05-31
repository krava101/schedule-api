import express from 'express';
import projectsController from '../controllers/projectsController.js';

const router = express.Router();
const jsonParser = express.json();

router.post('/create', jsonParser, projectsController.create);

export default router;