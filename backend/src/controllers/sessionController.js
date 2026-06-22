import mongoose from "mongoose";
import WorkSession from "../models/workSessionModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const addSession = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const newSession = new WorkSession({ ...req.body, userId });
  const savedSession = await newSession.save();
  
  res
    .status(201)
    .json({ message: "Session Created Successfully!", savedSession });
});

export const getSession = catchAsync(async (req, res, next) => {
  let { month } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Number(req.query.limit) || 20);
  const userId = req.user.id;

  const skip = (page - 1) * limit;

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
    $lte: endMonth,
  };

  if (
    (startDate && startDate.trim() !== "") ||
    (endDate && endDate.trim() !== "")
  ) {
    filter.createdAt = {};
    if (startDate && startDate.trim() !== "")
      filter.createdAt.$gte = new Date(startDate);
    if (endDate && endDate.trim() !== "")
      filter.createdAt.$lte = new Date(endDate);
  }

  const sessionsReceived = await WorkSession.find(filter)
    .sort({
      updatedAt: -1,
    })
    .skip(skip)
    .limit(limit);

    const totalCount = await WorkSession.countDocuments({userId: userId})
    const pages = Math.ceil(totalCount/limit)
    const sessions = {
  sessions: sessionsReceived,
  page: page,
  limit: limit,
  totalPages: pages,
  totalPosts: totalCount
}
  res.status(200).json(sessions);
});

export const updateSession = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Session ID", 404);
  }
  const updatedSession = req.body;
  const session = await WorkSession.findOneAndUpdate(
    { _id: id, userId: userId },
    updatedSession,
    { new: true },
  );
  if (!session) {
    throw new AppError("Session not found", 404);
  }
  await session.save();
  res.status(200).json(session);
});

export const deleteSession = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Session ID", 404);
  }
  const deleteResult = await WorkSession.deleteOne({ _id: id, userId: userId });
  if (deleteResult.deletedCount === 0) {
    throw new AppError("Session not found", 404);
  }
  res.status(200).json({
    message: "Session Deleted Successfully!",
  });
});

export const getStats = catchAsync(async (req, res, next) => {
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
    totalSessions: totalCount[0]?.count || 0,
    totalDuration: totalCount[0]?.duration || 0,
    sessionsByType,
  };

  res.json(result);
});
