import mongoose from "mongoose";

const workSessionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
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
  },
  {
    timestamps: true,
  },
);

const WorkSessionModel = mongoose.model("WorkSessionModel", workSessionSchema);

export default WorkSessionModel;
