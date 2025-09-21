import pool from "../config/db.js";

export const getAllFilmsWithActorsFromDB = async () => {
  const query = `
    SELECT f.film_id,
           f.title,
           f.description,
           f.release_year,
           f.rating,
           f.length,
           f.rental_rate,
           l.name AS language,
           c.name AS category,
           GROUP_CONCAT(CONCAT(a.first_name, ' ', a.last_name) ORDER BY a.last_name SEPARATOR ', ') AS actors
    FROM film f
    JOIN language l ON f.language_id = l.language_id
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    JOIN film_actor fa ON f.film_id = fa.film_id
    JOIN actor a ON fa.actor_id = a.actor_id
    GROUP BY f.film_id, f.title, f.description, f.release_year, f.length, f.rating, l.name, c.name
    ORDER BY f.title;
  `;
  const [rows] = await pool.query(query);
  return rows;
};
