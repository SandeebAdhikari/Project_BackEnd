import { getTopFiveFilmsFromDB } from "../models/topFiveFlimModel.js";

export const getTopFiveFilms = async (req, res) => {
  try {
    const films = await getTopFiveFilmsFromDB();
    res.json(films);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
