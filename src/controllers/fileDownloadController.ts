import { Response } from "express";
import { bucket } from "../config/gcsProvider";
import FileMetadata from "../models/FileMetadata";

const downloadFile = async (req: any, res: Response) => {
  if (!req.query.id) {
    console.log("ERROR: file download: no id send with query params..");
    return res.sendStatus(400);
  }
  const fileId = req.query.id;
  console.log("LOG: file download: fileId: " + fileId);

  try {
    // const dbResult = await FileMetadata.findOne({ _id: fileId });
    const dbResult = await FileMetadata.findById(fileId);
    if (dbResult === null) {
      return res.status(400).json({ message: "no file metadata in the db.." });
    }
    console.log("LOG: db result:");
    console.log(dbResult);

    const file = bucket.file(dbResult.name);
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(400).json({ message: "no file found in the bucket.." });
    }

    console.log("LOG: file download: file name: " + dbResult.name);

    // res.setHeader(
    //   "Content-Disposition",
    //   `attachment; fileName=${dbResult.name}`,
    // );
    res.setHeader("Content-Type", "application/octet-stream");

    const stream = file.createReadStream();
    stream.on("error", (err) => {
      console.log("ERROR: file download: " + (err as Error).message);
      return res.status(500).json({ message: "error streaming file.." });
    });

    console.log("LOG: file download: everything went successful");
    stream.pipe(res);
  } catch (err) {
    console.log("ERROR: file download: " + (err as Error).message);
    return res.status(500).json({ message: "error occurred" });
  }
  // return res.sendStatus(200);
};

export default downloadFile;
