
import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    paid: {
      type: String,
      required: true,
      default: "You",
    },
    icon: {
      type: String,
      default: "🧾",
    },
    groupId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
