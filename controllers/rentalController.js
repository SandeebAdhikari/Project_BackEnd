import {
  getRentalFilmByIdFromDB,
  getRentalsByFilmDB,
  markRentalAsReturned,
  addRentalRecord, // ✅ new model import
} from "../models/rentalModel.js";

export const getRentalFilmById = async (req, res) => {
  const { id } = req.query;
  try {
    const rentals = await getRentalFilmByIdFromDB(id);
    res.json(rentals);
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

// ✅ NEW CONTROLLER: Create a rental record
export const createRental = async (req, res) => {
  try {
    const { filmId, customerId, staffId, copies, rentalDuration } = req.body;

    if (!filmId || !customerId || !staffId || !copies || !rentalDuration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await addRentalRecord({
      filmId,
      customerId,
      staffId,
      copies,
      rentalDuration,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating rental:", error);
    res.status(500).json({ error: "Failed to create rental" });
  }
};
