import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post('/register', jsonParser, authController.register);
router.post('/verify', jsonParser, authController.verify);
router.post('/resend', jsonParser, authController.resendCode);
router.post('/login', jsonParser, authController.login);
router.post('/logout', authMiddleware, authController.logout);

export default router;