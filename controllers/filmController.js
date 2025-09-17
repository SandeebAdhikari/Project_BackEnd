import pool from "../config/db.js";

export const getTopFilms = async (req, res) => {
  const query = `
    SELECT f.film_id,
           f.title,
           c.name AS category,
           COUNT(r.rental_id) AS rented
    FROM film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    JOIN inventory i ON f.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY f.film_id, f.title, c.name
    ORDER BY rented DESC
    LIMIT 5;
  `;
  try {
    const [rows] = await pool.query(query);
    res.json(rows); // ✅ just return DB results
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
