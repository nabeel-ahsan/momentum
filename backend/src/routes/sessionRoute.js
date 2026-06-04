import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addSession, deleteSession, getSession, getStats, updateSession } from '../controllers/sessionController.js';

const router = express.Router()

router.route('/addSession').post(authMiddleware, addSession)
router.route('/getSession').get(authMiddleware,getSession)
router.route('/updateSession/:id').put(authMiddleware, updateSession)
router.route('/deleteSession/:id').delete(authMiddleware, deleteSession)
router.route('/stats').get(authMiddleware, getStats)

export default router;