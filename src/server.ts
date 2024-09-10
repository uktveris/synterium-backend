import { config, configDotenv } from "dotenv";
import express from "express";
import cors from "cors";

configDotenv();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

const messages = [
  { owner: "first", message: "my first message!" },
  { owner: "another", message: "what is this?" },
  { owner: "pilot", message: "hello there" },
  { owner: "mate", message: "the las one..." },
];

app.listen(PORT, () => {
  console.log("the app is running on port = " + PORT);
});

app.get("/", (req, res) => {
  res.status(200).send("hello from the server..");
});

app.get("/api/test", (req, res) => {
  res.status(200).send(messages);
});
