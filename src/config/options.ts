import { CookieOptions } from "express";

const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
  credentials: true,
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  // maxAge: 24 * 60 * 60000,
};

export { corsOptions, cookieOptions };
