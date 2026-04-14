import "dotenv/config";
import User from "../models/userModel.js";
import z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserSchema } from "../validators/authValidator.js";

export const signUp = async (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    console.log(result.error);
    const error = z.prettifyError(result.error);
    return res.status(400).send(error);
  }

  const { name, email, password } = result.data;
  const user = { name, email, password };
  const newUser = new User(user);
  await newUser.save();
  res.send("User created successfully!");
};

export const login = async (req, res) => {
  try {
    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error);
      const error = z.prettifyError(result.error);
      return res.status(400).send(error);
    }
    const { email, password } = result.data;
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return res.send("Invalid Credentials!");
    }
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (!match) {
      return res.send("Invalid Credentials!");
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    console.log("JWT SECRET: ", process.env.JWT_SECRET);
    

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
      issuer: "momentum-app",
      audience: "users",
    });
    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
