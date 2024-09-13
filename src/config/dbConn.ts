import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.DB_URI as string;

async function connectDB() {
  if (dbUri === undefined) console.log("DB_URI is undefined!!!");
  await mongoose
    .connect(dbUri, {})
    .catch((err) =>
      console.log("error while connecting to DB: " + (err as Error).message),
    );
}

export { connectDB };
