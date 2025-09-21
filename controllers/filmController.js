import { getAllFilmsWithActorsFromDB } from "../models/filmModel.js";

export const getAllFilmsWithActors = async (req, res) => {
  try {
    const films = await getAllFilmsWithActorsFromDB();
    res.json(films);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
