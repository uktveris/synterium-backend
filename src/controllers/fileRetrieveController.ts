import { Request, Response } from "express";

const messages = [
  {
    owner: "first owner",
    message: "first msg",
  },
  {
    owner: "second owner",
    message: "another msg",
  },
  {
    owner: "last owner",
    message: "more msg",
  },
];

const fetchFiles = (req: Request, res: Response) => {
  return res.status(200).send(messages);
};

export default fetchFiles;
