// import { config, configDotenv } from "dotenv";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { users } from "./constants";
import bodyParser from "body-parser";
import { logger } from "./middleware/eventLogger";
import { corsOptions } from "./config/corsOptions";
import jwt from "jsonwebtoken";
import { verifyJwt } from "./middleware/jwtVerifier";
import mongoose from "mongoose";
import { connectDB } from "./config/dbConn";
import { User } from "./models/User";
import bcrypt from "bcrypt";

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

const messages = [
  { owner: "first", message: "my first message!" },
  { owner: "another", message: "what is this?" },
  { owner: "pilot", message: "hello there" },
  { owner: "mate", message: "the las one..." },
];

app.get("/", (req, res) => {
  res.status(200).send("hello from the server..");
});

app.get("/api/test", (req, res) => {
  res.status(200).send(messages);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "both email and password are required!" });
  }
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "conflict. user already exists in the DB!" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  console.log("email: " + email);
  console.log("password: " + hashedPwd);
  const result = await User.create({
    email: email,
    password: hashedPwd,
  }).catch((err) => {
    console.log(
      "error occurred while inserting user: " + (err as Error).message,
    );
    return res.status(500).json({ message: (err as Error).message });
  });

  console.log(result);
  return res.status(201).json({ success: "new user " + email + " created!" });
});

app.post("/login", async (req, res) => {
  console.log("req origin: " + req.headers.origin);
  console.log(req.body);
  const { email, password } = req.body;
  console.log("received email: " + email);
  console.log("received password: " + password);

  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    return res.status(401).send({ msg: "no user found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).send({ msg: "incorrect password" });
  }

  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" },
  );
  console.log("hello");
  user.refreshToken = refreshToken;
  const result = await user.save();
  console.log("result: " + result);

  res.cookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60000 });
  return res.json({ accessToken });
});

app.get("/refresh", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(401).send({ msg: "no jwt sent with cookie!" });
  }

  console.log("cookies from jwt: ");
  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res
      .status(403)
      .send({ msg: "no matching jwt for this user found!" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err || user.email !== decoded.email) {
        return res.status(403).send({
          msg: "error while processing jwt: " + (err as Error).message,
        });
      }
      const accessToken = jwt.sign(
        { email: decoded.email },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15min" },
      );
      console.log("success! refreshed accesstoken!");
      return res.json({ accessToken });
    },
  );
});

app.post("logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  user.refreshToken = "";
  const result = await user.save();
  res.clearCookie("jwt", { httpOnly: true });
  return res.sendStatus(204);
});

app.get("/auth", verifyJwt, (req, res) => {
  return res
    .status(200)
    .send({ msg: "you reached the endpoint successfully!" });
});

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB!");
  app.listen(PORT, () => {
    console.log("the app is running on port = " + PORT);
  });
});
