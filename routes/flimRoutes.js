import express from "express";
import {
  getAllFilmsWithActors,
  getTopFiveFilms,
  getFilmById,
} from "../controllers/filmController.js";

const router = express.Router();

router.get("/all-films", getAllFilmsWithActors);
router.get("/top-films", getTopFiveFilms);
router.get("/:id", getFilmById);

export default router;
