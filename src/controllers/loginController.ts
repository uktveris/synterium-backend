import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookieOptions } from "../config/options";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    console.log("LOG: login: no user in the db found");
    return res.status(401).send({ msg: "no user found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    console.log("LOG: login: passwords did not match");
    return res.status(401).send({ msg: "incorrect password" });
  }

  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "10m" },
  );
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" },
  );
  user.refreshToken = refreshToken;
  const result = await user.save();
  console.log("result: " + result);

  res.cookie("refresh", refreshToken, cookieOptions);
  res.cookie("access", accessToken, cookieOptions);
  console.log("returning access token: " + accessToken);
  return res.json({ accessToken });
};

export default login;
