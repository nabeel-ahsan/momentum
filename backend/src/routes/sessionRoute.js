import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addSession } from '../controllers/sessionController.js';

const router = express.Router()

router.route('/addSession').post(authMiddleware, addSession)

export default router;