import {
  getAllFilmsWithActorsFromDB,
  getTopFiveFilmsFromDB,
  getFilmByIdFromDB,
} from "../models/filmModel.js";

export const getAllFilmsWithActors = async (req, res) => {
  try {
    const films = await getAllFilmsWithActorsFromDB();
    res.json(films);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getTopFiveFilms = async (req, res) => {
  try {
    const films = await getTopFiveFilmsFromDB();
    res.json(films);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const film = await getFilmByIdFromDB(id);
    if (!film) {
      return res.status(404).json({ error: "Film not found" });
    }
    res.json(film);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
