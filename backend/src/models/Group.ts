
import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    members: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
