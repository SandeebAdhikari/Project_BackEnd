import express from "express";
import {
  fetchTopActors,
  getTopFilmsByActor,
} from "../controllers/actorController.js";

const router = express.Router();

router.get("/top-actors", fetchTopActors);
router.get("/:id/top-films", getTopFilmsByActor);

export default router;
