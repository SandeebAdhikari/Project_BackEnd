import express from "express";
import { fetchTopActors } from "../controllers/topActorController.js";

const router = express.Router();

router.get("/top-actors", fetchTopActors);

export default router;
