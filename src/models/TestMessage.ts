import mongoose from "mongoose";
import { Schema } from "mongoose";

const testMessageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

const TestMessage = mongoose.model("TestMessage", testMessageSchema);

export default TestMessage;
