import pool from "../config/db.js";

export const getTopActor = async (req, res) => {
  const query = `
    SELECT a.actor_id,
       a.first_name,
       a.last_name,
       a.last_update,
       COUNT(fa.film_id) AS movies
    FROM actor a
    JOIN film_actor fa ON a.actor_id = fa.actor_id
    GROUP BY a.actor_id, a.first_name, a.last_name
    ORDER BY movies DESC
    LIMIT 5;
  `;
  try {
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
