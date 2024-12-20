import { Request, Response } from "express";
import TestMessage from "../models/TestMessage";

// const messages = [
//   {
//     owner: "first owner",
//     message: "first msg",
//   },
//   {
//     owner: "second owner",
//     message: "another msg",
//   },
//   {
//     owner: "last owner",
//     message: "more msg",
//   },
// ];

const fetchFiles = async (req: any, res: Response) => {
  const { email, id } = req.user;
  if (!email || !id) {
    console.log("ERROR: no id or email");
    return res.sendStatus(400);
  }

  try {
    const messages = await TestMessage.find({ owner: id });
    const mappedMsg = messages.map((msg) => msg.message);
    return res.status(201).json({ mappedMsg });
  } catch (err) {
    console.log("ERROR fetchfiles: " + (err as Error).message);
    return res.sendStatus(400);
  }
};

const postMessage = async (req: any, res: Response) => {
  const { email, id } = req.user;

  if (!email || !id) {
    console.log("ERROR: no id or email");
    return res.sendStatus(400);
  }

  if (!req.body.inputValue) {
    console.log("EROR: postmsg: no input value..");
    return res.sendStatus(400);
  }

  console.log("LOG: postmsg: email: " + email);
  console.log("LOG: postmsg: id: " + id);
  console.log("LOG: postmsg: req.body:");
  const msg = req.body.inputValue;

  try {
    const result = await TestMessage.create({
      message: msg,
      owner: id,
    });
    console.log(result);
  } catch (err) {
    console.log("ERROR: postmsg: " + (err as Error).message);
    return res.status(500).json({ message: (err as Error).message });
  }
  return res.sendStatus(201);
};

export default fetchFiles;

export { postMessage };
