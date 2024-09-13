import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

const User = mongoose.model("User", userSchema);

export { User };
