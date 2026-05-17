import mongoose from "mongoose";

const workSessionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['DSA', 'Development', 'Applications', 'Learning', 'Other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    link: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
  },
);

const WorkSession = mongoose.model("WorkSession", workSessionSchema);

export default WorkSession;
