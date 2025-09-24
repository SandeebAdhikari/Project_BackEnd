import express from "express";
import {
  getRentalFilmById,
  getRentalsByFilm,
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/all-rentals", getRentalFilmById);
router.get("/film/:filmId", getRentalsByFilm);

export default router;
