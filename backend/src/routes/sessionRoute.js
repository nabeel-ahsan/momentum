import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addSession, getSession } from '../controllers/sessionController.js';

const router = express.Router()

router.route('/addSession').post(authMiddleware, addSession)
router.route('/getSession').get(authMiddleware,getSession)

export default router;