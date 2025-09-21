import express from "express";
import { fetchTopActors } from "../controllers/actorController.js";

const router = express.Router();

router.get("/top-actors", fetchTopActors);

export default router;
