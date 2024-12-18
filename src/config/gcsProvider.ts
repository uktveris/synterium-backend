import { Storage } from "@google-cloud/storage";
import path from "path";

const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "../../",
    process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
  ),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket("synterium-bucket");

export { bucket };
