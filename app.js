import express from "express";
import cors from "cors";
import actorRoutes from "./routes/actorRoutes.js";
import filmRoutes from "./routes/flimRoutes.js";
import customersRoutes from "./routes/customerRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Routes
app.use("/api/films", filmRoutes);
app.use("/api/actors", actorRoutes);
app.use("/api/customers", customersRoutes);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
