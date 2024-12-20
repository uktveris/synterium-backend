import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { cookieOptions } from "../config/options";

const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.refresh) {
    console.log("LOG: refresh - no jwt was sent with a cookie");
    return res.status(401).send({ msg: "no jwt sent with cookie!" });
  }

  console.log("LOG: refresh- cookies from jwt: ");
  console.log(cookies.refresh);

  const refreshToken = cookies.refresh;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res
      .status(403)
      .send({ msg: "no matching jwt for this user found!" });
  }

  const userId = user._id.toString();

  const jwtPayload = {
    id: userId,
    email: user.email,
  };

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
        // { email: decoded.email },
        jwtPayload,
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "10m" },
      );
      console.log("LOG: refresh - success! refreshed accesstoken!");
      res.clearCookie("access", cookieOptions);
      res.cookie("access", accessToken, cookieOptions);
      return res.json({ accessToken });
    },
  );
};

export default refresh;
