import pool from "../config/db.js";

export const getTopFiveFilmsFromDB = async () => {
  const query = `
    SELECT f.film_id,
           f.title,
           f.release_year,
           f.rating,
           c.name AS category,
           COUNT(r.rental_id) AS rented
    FROM film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    JOIN inventory i ON f.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY f.film_id, f.title, f.release_year, f.rating, c.name
    ORDER BY rented DESC
    LIMIT 5;
  `;
  const [rows] = await pool.query(query);
  return rows;
};
