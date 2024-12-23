import mongoose from "mongoose";
import { Schema } from "mongoose";

const fileMetadataSchema = new Schema({
  ownerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  uploadDateTime: {
    type: Date,
    default: Date.now(),
  },
});

const FileMetadata = mongoose.model("fileMetadata", fileMetadataSchema);

export default FileMetadata;
