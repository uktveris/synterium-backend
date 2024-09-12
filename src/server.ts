import { config, configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { users } from "./constants";
import bodyParser from "body-parser";
import { logger } from "./middleware/eventLogger";
import { corsOptions } from "./config/corsOptions";
import jwt from "jsonwebtoken";

configDotenv();

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

app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log("received email: " + email);
  console.log("received password: " + password);
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).send({ msg: "no user found" });
  } else if (user.password !== password) {
    return res.status(400).send({ msg: "incorrect password" });
  }
  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "5m" },
  );
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" },
  );
  console.log("hello");
  // return res.status(201).send({ msg: "successfully logged in!" });
  res.cookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60000 });
  return res.json({ accessToken });
});

app.listen(PORT, () => {
  console.log("the app is running on port = " + PORT);
});
