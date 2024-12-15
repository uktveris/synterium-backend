import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

function verifyJwt(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log(
      "LOG: jwtverifier - problem: Authorization header was not avaiable",
    );
    return res.sendStatus(401);
  }
  console.log("LOG: verifyJwt - auth header:");
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  console.log("LOG: verifyJwt - token value: " + token);
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        console.log("LOG: verifyJwt - error: " + (err as Error).message);
        return res.sendStatus(403);
      }
      req.user = decoded.email;
      next();
    },
  );
}

export { verifyJwt };
