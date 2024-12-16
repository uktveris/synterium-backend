import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response) => {
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
};

export default register;
