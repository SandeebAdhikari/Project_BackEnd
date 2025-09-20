import express from "express";
import cors from "cors";
import filmRoutes from "./routes/topFiveFilmRoutes.js";
import actorRoutes from "./routes/topActorRoutes.js";

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

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
