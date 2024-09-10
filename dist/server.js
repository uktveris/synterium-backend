"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.configDotenv)();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
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
