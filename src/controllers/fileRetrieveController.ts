import { Request, Response } from "express";
import FileMetadata from "../models/FileMetadata";

const fetchFiles = async (req: any, res: Response) => {
  const { email, id } = req.user;
  if (!email || !id) {
    console.log("ERROR: no id or email");
    return res.sendStatus(400);
  }

  try {
    const files = await FileMetadata.find({ ownerId: id });
    return res.status(201).json({ files });
  } catch (err) {
    console.log("ERROR fetchfiles: " + (err as Error).message);
    return res.sendStatus(400);
  }
};

export default fetchFiles;
