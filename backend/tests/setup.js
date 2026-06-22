import mongoose from "mongoose";
import "dotenv/config";

const testDbUrl = process.env.DB_URI_TEST;

beforeAll(async () => {
  await mongoose.connect(testDbUrl);
});

afterAll(async () => {
  await mongoose.disconnect();
});
