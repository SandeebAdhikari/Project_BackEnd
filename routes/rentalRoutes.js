import express from "express";
import {
  getRentalFilmById,
  getRentalsByFilm,
  returnRental,
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/all-rentals", getRentalFilmById);
router.get("/film/:filmId", getRentalsByFilm);
router.put("/:rentalId/return", returnRental);

export default router;
