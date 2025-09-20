import pool from "../config/db.js";

export const getTopActor = async (req, res) => {
  const query = `
    SELECT a.actor_id,
       a.first_name,
       a.last_name,
       COUNT(DISTINCT fa.film_id) AS film_count,
       COUNT(r.rental_id) AS rental_count
    FROM actor a
    JOIN film_actor fa ON a.actor_id = fa.actor_id
    JOIN inventory i ON fa.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY a.actor_id, a.first_name, a.last_name
    ORDER BY rental_count DESC
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
