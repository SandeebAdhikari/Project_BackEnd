import { getTopActorsInInventory } from "../models/actorModel.js";

export const fetchTopActors = async (req, res) => {
  try {
    const actors = await getTopActorsInInventory();
    res.json(actors);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
