import express from 'express';
import usersController from '../controllers/usersController.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/current', usersController.current);
router.post('/invite', jsonParser, usersController.acceptInvite);
router.patch('/rename', jsonParser, usersController.rename);

export default router;