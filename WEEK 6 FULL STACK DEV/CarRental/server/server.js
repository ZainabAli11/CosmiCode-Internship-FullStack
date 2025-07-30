import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/connectDB.js";

import userRouter from "./routes/userRoutes.js";

const app = express();

// ✅ This MUST come before routes and JSON parsing
app.use(cors({
  origin: "http://localhost:5173", // Match React dev server
  credentials: true
}));

app.use(express.json());

// ✅ These are the correct routes
app.use("/api/auth", userRouter);
app.use("/api/user", userRouter); // You MUST have this for /user/data and /user/cars to work

// ✅ Optional test route to debug CORS
app.get("/api/test", (req, res) => {
  res.json({ message: "CORS is working ✅" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
