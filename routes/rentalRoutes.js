import express from "express";
import {
  getRentalFilmById,
  getRentalsByFilm,
  returnRental,
  createRental,
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/all-rentals", getRentalFilmById);
router.get("/film/:filmId", getRentalsByFilm);
router.put("/:rentalId/return", returnRental);
router.post("/", createRental);

export default router;
