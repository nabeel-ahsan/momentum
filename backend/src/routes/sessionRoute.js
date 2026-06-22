import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addSession, deleteSession, getSession, getStats, updateSession } from '../controllers/sessionController.js';
import { validatorMiddleware } from '../middleware/validatorMiddleware.js';
import { SessionSchema } from '../validators/sessionValidator.js';

const router = express.Router()

router.route('/').post(authMiddleware,validatorMiddleware(SessionSchema) , addSession)
router.route('/').get(authMiddleware,getSession)
router.route('/:id').put(authMiddleware,validatorMiddleware(SessionSchema), updateSession)
router.route('/:id').delete(authMiddleware, deleteSession)
router.route('/stats').get(authMiddleware, getStats)

export default router;