import { Request, Response } from "express";
import { bucket } from "../config/gcsProvider";
import FileMetadata from "../models/FileMetadata";

const fileUpload = async (req: any, res: Response) => {
  const { email, id } = req.user;
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    console.log("ERROR: file-upload: no files came with req..");
    return res.status(400).send({ message: "no files received" });
  }

  try {
    const uploadPromises = files.map(async (f) => {
      const file = bucket.file(f.originalname);
      const stream = file.createWriteStream({
        resumable: false,
        metadata: {
          contentType: f.mimetype,
        },
      });

      return new Promise<void>((resolve, reject) => {
        stream.on("error", (err) => {
          console.log(
            "ERROR: crashed file uploading file: " +
              f.originalname +
              ": error: " +
              (err as Error).message,
          );
          reject(err);
        });

        stream.on("finish", () => {
          console.log("LOG: uploaded file!: " + f.originalname);

          const dbResult = FileMetadata.create({
            ownerId: id,
            name: f.originalname,
            size: f.size,
            fileType: f.mimetype,
          }).catch((err) =>
            console.log("ERROR: fileUpload: " + (err as Error).message),
          );
          console.log("LOG: fileUpload: db result:");
          console.log(dbResult);

          resolve();
        });

        stream.end(f.buffer);
      });
    });

    await Promise.all(uploadPromises);
    console.log("LOG: all files uploaded!");
    return res.status(200).json({
      message: "files uploaded!",
      files: files.map((f) => f.originalname),
    });
  } catch (err) {
    console.log(
      "ERROR: error while uploading files: " + (err as Error).message,
    );
    return res.status(400).json({
      message: "error while uploading files: " + (err as Error).message,
    });
  }

  console.log("LOG: file-upload: success: received files:");
  console.log(files);

  return res.sendStatus(200);
};

export default fileUpload;
