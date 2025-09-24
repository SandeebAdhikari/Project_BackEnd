import {
  getRentalFilmByIdFromDB,
  getRentalsByFilmDB,
} from "../models/rentalModel.js";

export const getRentalFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const rental = await getRentalFilmByIdFromDB(id);
    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }
    res.json(rental);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getRentalsByFilm = async (req, res) => {
  try {
    const { filmId } = req.params;
    const rentals = await getRentalsByFilmDB(filmId);
    res.json(rentals);
  } catch (err) {
    console.error("Error fetching rentals by film:", err);
    res.status(500).json({ error: "Server error" });
  }
};
