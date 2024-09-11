import { config, configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { users } from "./constants";
import bodyParser from "body-parser";

configDotenv();

const PORT = process.env.PORT;
const SECRET = process.env.SESSION_SECRET || "default-secret";
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 * 3, secure: false },
  }),
);

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
  console.log("hello");
  req.session.user = { email };
  console.log("session info:");
  console.log(req.session);
  console.log(req.session.id);
  return res.status(201).send({ msg: "successfully logged in!" });
});
