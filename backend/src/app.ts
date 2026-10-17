
import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to SplitMate API!",
    status: "running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "SplitMate backend is working!",
  });
});

app.use("/api/expenses", expenseRoutes);

export default app;
