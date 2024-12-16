import dotenv from "dotenv";
import express, { CookieOptions } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { logger } from "./middleware/eventLogger";
import { corsOptions } from "./config/options";
import mongoose from "mongoose";
import { connectDB } from "./config/dbConn";
import routes from "./routes/index";

connectDB();

dotenv.config();

const PORT = process.env.PORT;
const SECRET = process.env.SESSION_SECRET || "default-secret";

const app = express();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB!");
  app.listen(PORT, () => {
    console.log("the app is running on port = " + PORT);
  });
});
