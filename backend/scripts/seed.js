import mongoose from "mongoose";
import "dotenv/config";
import User from "../src/models/userModel.js";
import WorkSession from "../src/models/workSessionModel.js";

// 1. Ensure DB_URI is loaded from environment variables
if (!process.env.DB_URI) {
  console.error(
    "Error: DB_URI is not defined in the environment. Make sure your .env file exists in the backend directory.",
  );
  process.exit(1);
}

try {
  console.log("Connecting to database...");
  await mongoose.connect(process.env.DB_URI);
  console.log("Database connection successful!");

  let targetUser;

  targetUser = await User.findOne({ email: "john11@doe.com" });
  if (!targetUser) {
    console.error(
      "Error: No user found in the database. Please register an account on the UI first!",
    );
    await mongoose.connection.close();
    process.exit(1);
  }

  const userId = targetUser._id;
  console.log(
    `Seeding sessions for user: ${targetUser.name} (${targetUser.email})`,
  );

  const types = ["DSA", "Development", "Applications", "Learning", "Other"];
  const statuses = ["Completed", "In Progress"];
  const sessions = [];

  for (let i = 1; i <= 132; i++) {
    sessions.push({
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      title: `Focus Block #${i}`,
      duration: Math.floor(Math.random() * 180) + 15,
      notes: `Engineering notes and documentation logs for session index ${i}`,
      link: `https://example.com/session-${i}`,
      userId: userId,
    });
  }
  await WorkSession.deleteMany({ userId });
  await WorkSession.insertMany(sessions);
  console.log("Successfully seeded 132 focus sessions!");
} catch (error) {
  console.error("Seeding failed with error: ", error);
} finally {
  await mongoose.connection.close();
  console.log("Database connection closed.");
}
