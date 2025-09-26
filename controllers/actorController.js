import {
  getTopActorsInInventory,
  getTopFilmsByActorFromDB,
} from "../models/actorModel.js";

export const fetchTopActors = async (req, res) => {
  try {
    const actors = await getTopActorsInInventory();
    res.json(actors);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getTopFilmsByActor = async (req, res) => {
  try {
    const { id } = req.params;
    const films = await getTopFilmsByActorFromDB(id);

    if (!films || films.length === 0) {
      return res.status(404).json([]);
    }

    res.json(films);
  } catch (err) {
    console.error("Error fetching top films:", err);
    res.status(500).json({ error: "Failed to fetch films" });
  }
};
