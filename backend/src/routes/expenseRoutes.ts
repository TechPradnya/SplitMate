
import { Router } from "express";
import Expense from "../models/Expense";

const router = Router();

// Get all expenses
router.get("/", async (_req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// Add a new expense
router.post("/", async (req, res) => {
  try {
    const { name, amount, paid, icon, groupId } = req.body;

    if (!name || typeof name !== "string" || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      res.status(400).json({ message: "Provide a name and a valid amount greater than zero" });
      return;
    }

    const expense = await Expense.create({
      name: name.trim(),
      amount: Number(amount),
      paid: paid || "You",
      icon: icon || "🧾",
      groupId: groupId || "",
    });

    res.status(201).json(expense);
  } catch {
    res.status(500).json({ message: "Failed to create expense" });
  }
});

export default router;
