import "dotenv/config";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  const newUser = new User(user);
  await newUser.save();
  res.status(201).json({
    success: true,
    message: "User created successfully"
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    throw new AppError("Invalid Credentials!", 401);
  }
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError("Invalid Credentials!", 401);
  }

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
    issuer: "momentum-app",
    audience: "users",
  });
  
  res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
