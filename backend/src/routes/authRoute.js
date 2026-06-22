import express from "express";
import { login, signUp } from "../controllers/authController.js";
import { validatorMiddleware } from "../middleware/validatorMiddleware.js";
import { LoginSchema, RegisterSchema } from "../validators/authValidator.js";
const router = express.Router();

router.route("/signup").post(validatorMiddleware(RegisterSchema), signUp);
router.route("/login").post(validatorMiddleware(LoginSchema), login);

export default router;
