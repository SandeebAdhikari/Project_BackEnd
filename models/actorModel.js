import pool from "../config/db.js";

export const getTopActorsInInventory = async () => {
  const query = `
    SELECT a.actor_id,
           a.first_name,
           a.last_name,
           COUNT(DISTINCT fa.film_id) AS film_count,
           COUNT(r.rental_id) AS rental_count
    FROM actor a
    JOIN film_actor fa ON a.actor_id = fa.actor_id
    JOIN inventory i ON fa.film_id = i.film_id
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY a.actor_id, a.first_name, a.last_name
    ORDER BY film_count DESC, rental_count DESC
    LIMIT 5;
  `;
  const [rows] = await pool.query(query);
  return rows;
};

export const getTopFilmsByActorFromDB = async (actorId) => {
  const query = `
    SELECT 
      f.film_id,
      f.title,
      f.release_year,
      f.rating,
      c.name AS category,
      COUNT(r.rental_id) AS rented
    FROM film f
    JOIN film_actor fa ON f.film_id = fa.film_id
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    LEFT JOIN inventory i ON f.film_id = i.film_id
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id
    WHERE fa.actor_id = ?
    GROUP BY f.film_id, f.title, f.release_year, f.rating, c.name
    ORDER BY rented DESC
    LIMIT 5;
  `;

  const [rows] = await pool.query(query, [actorId]);
  return rows;
};
