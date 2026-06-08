import "dotenv/config";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  const newUser = new User(user);
  await newUser.save();
  res.status(201).json({
    message: "User created successfully"
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return res.json({message: "Invalid Credentials!"});
  }
  const match = await bcrypt.compare(password, user.password);
  console.log(match);
  if (!match) {
    return res.json({message: "Invalid Credentials!"});
  }

  try {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    console.log("JWT SECRET: ", process.env.JWT_SECRET);
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
      issuer: "momentum-app",
      audience: "users",
    });
    res.status(200).json({
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
