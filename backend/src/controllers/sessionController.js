import mongoose from "mongoose";
import WorkSession from "../models/workSessionModel.js";

export const addSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const newSession = new WorkSession({ ...req.body, userId });
    const savedSession = await newSession.save();
    res
      .status(201)
      .json({ message: "Session Created Successfully!", savedSession });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const getSession = async (req, res) => {
  let { month } = req.query;
  const userId = req.user.id;
  
  const { type, startDate, endDate } = req.query;
  const filter = { userId: userId };
  if (type) {
    filter.type = type;
  }

  if (!month) {
    month = new Date().toISOString().slice(0, 7);
  }
  
  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const startMonth = new Date(Date.UTC(year, monthIndex, 1, 1, 0, 0, 0, 0));
  const endMonth = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0));

  filter.createdAt = {
    $gte: startMonth,
    $lte: endMonth
  }
  
  if ((startDate && startDate.trim() !== "") || (endDate && endDate.trim() !== "")) {
  filter.createdAt = {};
  if (startDate && startDate.trim() !== "") filter.createdAt.$gte = new Date(startDate);
  if (endDate && endDate.trim() !== "") filter.createdAt.$lte = new Date(endDate);
}
  
  try {
    const session = await WorkSession.find(filter).sort({
      updatedAt: -1,
    });
    res.status(200).json(session);
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const updateSession = async (req, res) => {
  const userId = req.user.id;
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Invalid Session ID",
      });
    }
    const updatedSession = req.body;
    const session = await WorkSession.findOneAndUpdate(
      { _id: id, userId: userId },
      updatedSession,
      { new: true },
    );
    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }
    await session.save();
    return res.status(201).json(session);
  } catch (e) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
};

export const deleteSession = async (req, res) => {
  const userId = req.user.id;
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Invalid Session ID",
      });
    }
    await WorkSession.deleteOne({ _id: id, userId: userId });
    res.status(200).json({
      message: "Session Deleted Successfully!",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStats = async (req, res) => {
  let { month } = req.query;
  if (!month) {
    month = new Date().toISOString().slice(0, 7);
  }

  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const startMonth = new Date(Date.UTC(year, monthIndex, 1, 1, 0, 0, 0, 0));
  const endMonth = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0));

  const userId = req.user.id;
  const objectId = new mongoose.Types.ObjectId(userId);
  const totalCount = await WorkSession.aggregate([
    {
      $match: {
        userId: objectId,
        createdAt: {
          $gte: startMonth,
          $lt: endMonth,
        },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        duration: { $sum: "$duration" },
      },
    },
  ]);

  const groupByCategory = await WorkSession.aggregate([
    {
      $match: {
        userId: objectId,
        createdAt: {
          $gte: startMonth,
          $lt: endMonth,
        },
      },
    },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
  ]);

  const sessionsByType = groupByCategory.reduce((acc, type) => {
    const key = type._id;
    const value = type.count;

    acc[key] = (acc[key] || 0) + value;
    return acc;
  }, {});

  const result = {
    totalSessions: totalCount[0]?.count,
    totalDuration: totalCount[0]?.duration,
    sessionsByType,
  };

  res.json(result);
};
