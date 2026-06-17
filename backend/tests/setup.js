import mongoose from "mongoose";
import "dotenv/config";

const testDbUrl = process.env.DB_URI_TEST;

beforeAll(async () => {
  await mongoose.connect(testDbUrl);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
