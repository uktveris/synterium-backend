import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log("LOG: refresh - accessing refresh endpoint");
  if (!cookies.jwt) {
    console.log("LOG: refresh - no jwt was sent with a cookie");
    return res.status(401).send({ msg: "no jwt sent with cookie!" });
  }

  console.log("LOG: refresh- cookies from jwt: ");
  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res
      .status(403)
      .send({ msg: "no matching jwt for this user found!" });
  }

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
        { email: decoded.email },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "30s" },
        // { expiresIn: "15min" },
      );
      console.log("LOG: refresh - success! refreshed accesstoken!");
      return res.json({ accessToken });
    },
  );
};

export default refresh;
