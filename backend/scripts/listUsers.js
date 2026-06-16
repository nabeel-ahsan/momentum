import mongoose from "mongoose";
import "dotenv/config";
import WorkSession from "../src/models/workSessionModel.js";

try {
  await mongoose.connect(process.env.DB_URI);
  
  const userId = "6a12e71f9bc1936d48c11afd"; // Mohd Shavez
  const month = "2026-06";
  
  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const startMonth = new Date(Date.UTC(year, monthIndex, 1, 1, 0, 0, 0, 0));
  const endMonth = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0));

  const filter = {
    userId: new mongoose.Types.ObjectId(userId),
    createdAt: {
      $gte: startMonth,
      $lte: endMonth
    }
  };

  const sessions = await WorkSession.find(filter).sort({ updatedAt: -1 });
  console.log(`QUERY STATS:`);
  console.log(`- startMonth: ${startMonth.toISOString()}`);
  console.log(`- endMonth:   ${endMonth.toISOString()}`);
  console.log(`- Found Sessions Count: ${sessions.length}`);
  if (sessions.length > 0) {
    console.log(`- Sample Session:`, JSON.stringify(sessions[0], null, 2));
  }
} catch (err) {
  console.error(err);
} finally {
  await mongoose.connection.close();
  process.exit();
}
