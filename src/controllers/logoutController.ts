import { Request, Response } from "express";
import { cookieOptions } from "../config/options";
import { User } from "../models/User";

const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.refresh) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.refresh;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refresh", cookieOptions);
    res.clearCookie("access", cookieOptions);
    return res.sendStatus(204);
  }

  user.refreshToken = "";
  const result = await user.save();
  res.clearCookie("refresh", cookieOptions);
  res.clearCookie("access", cookieOptions);
  console.log("LOG: logout: user after clearing refresh token:");
  console.log(user);
  return res.sendStatus(204);
};

export default logout;
