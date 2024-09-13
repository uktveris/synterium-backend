import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

function verifyJwt(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.sendStatus(401);
  }
  console.log("auth header:");
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded.email;
      next();
    },
  );
}

export { verifyJwt };
