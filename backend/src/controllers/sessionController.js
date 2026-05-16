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
    res.status(201).json({message: "Session Created Successfully!", savedSession})
  } catch (error) {
    res.status(500).json({error: "Internal Server Error!"})
  }
};
