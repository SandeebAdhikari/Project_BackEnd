import {
  getRentalFilmByIdFromDB,
  getRentalsByFilmDB,
  markRentalAsReturned,
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

export const returnRental = async (req, res) => {
  try {
    const { rentalId } = req.params;
    const success = await markRentalAsReturned(rentalId);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Rental not found or already returned" });
    }

    res.json({ message: "Rental marked as returned successfully" });
  } catch (error) {
    console.error("Error marking rental as returned:", error);
    res.status(500).json({ error: "Failed to update rental" });
  }
};
