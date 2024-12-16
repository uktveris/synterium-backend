import { Request, Response } from "express";
import { cookieOptions } from "../config/options";
import { User } from "../models/User";

const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken });
  console.log("LOG: logout: found user by refresh token:");
  console.log(user);

  if (!user) {
    res.clearCookie("jwt", cookieOptions);
    return res.sendStatus(204);
  }

  user.refreshToken = "";
  const result = await user.save();
  res.clearCookie("jwt", cookieOptions);
  console.log("LOG: logout: user after clearing refresh token:");
  console.log(user);
  return res.sendStatus(204);
};

export default logout;
