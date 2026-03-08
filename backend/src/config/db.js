import mongoose from "mongoose";

export async function dbConnection() {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log("DB Connection Successful!");
  } catch (error) {
    console.erro("DB Connection Error: ", error)
  }
}
