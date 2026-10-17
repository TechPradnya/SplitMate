import { Router } from "express";
import Group from "../models/Group";

const router = Router();

// Get all groups
router.get("/", async (_req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
});

// Create a group
router.post("/", async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ message: "Group name is required" });
      return;
    }

    const group = await Group.create({
      name: name.trim(),
      members: Array.isArray(members) ? members : [],
    });

    res.status(201).json(group);
  } catch {
    res.status(500).json({ message: "Failed to create group" });
  }
});

export default router;