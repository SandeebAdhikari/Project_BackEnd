import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import filmRoutes from "./routes/filmRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/films", filmRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
