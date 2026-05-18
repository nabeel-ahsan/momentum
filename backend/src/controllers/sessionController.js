import mongoose from "mongoose";
import WorkSession from "../models/workSessionModel.js";
import { SessionSchema } from "../validators/sessionValidator.js";

export const addSession = async (req, res) => {
  try {
    const result = SessionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const userId = req.user.id;
    const newSession = new WorkSession({ ...result.data, userId });
    const savedSession = await newSession.save();
    res
      .status(201)
      .json({ message: "Session Created Successfully!", savedSession });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const getSession = async (req, res) => {
  const userId = req.user.id;
  try {
    const session = await WorkSession.find({ userId: userId }).sort({
      updatedAt: -1,
    });
    console.log(session);
    res.status(200).json(session);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const updateSession = async (req, res) => {
  const userId = req.user.id;
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({
        message: "Invalid Session ID"
      })
    }
    const updatedSession = req.body;
    const session = await WorkSession.findOneAndUpdate(
      { _id: id, userId: userId },
      updatedSession,
      {new:true}
    );
    if(!session) {
      return res.status(404).json({
        message: "Session not found"
      })
    }
    await session.save();
    console.log("UpdatedSession: ", updatedSession);

    console.log("Session:", session);
    return res.status(201).json(session);
  } catch (error) {
    return res.json(error);
  }
};
