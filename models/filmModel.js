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

export const getFilmByIdFromDB = async (id) => {
  const query = `
    SELECT 
      f.film_id,
      f.title,
      f.description,
      f.release_year,
      f.rating,
      f.rental_duration,
      l.name AS language,
      f.length,
      f.rental_rate,
      GROUP_CONCAT(DISTINCT c.name) AS categories,
      GROUP_CONCAT(DISTINCT CONCAT(a.first_name, ' ', a.last_name) SEPARATOR ', ') AS actors,
      COUNT(i.inventory_id) AS total_copies,
      SUM(CASE WHEN r.return_date IS NULL THEN 1 ELSE 0 END) AS rented_out,
      COUNT(i.inventory_id) - SUM(CASE WHEN r.return_date IS NULL THEN 1 ELSE 0 END) AS available
    FROM film f
    JOIN language l ON f.language_id = l.language_id
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    JOIN film_actor fa ON f.film_id = fa.film_id
    JOIN actor a ON fa.actor_id = a.actor_id
    LEFT JOIN inventory i ON f.film_id = i.film_id
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id
    WHERE f.film_id = ?
    GROUP BY f.film_id, f.title, f.description, f.release_year, f.rating,
             f.rental_duration, l.name, f.length, f.rental_rate
  `;

  const [rows] = await pool.query(query, [id]);

  if (!rows[0]) return null;

  return {
    ...rows[0],
    categories: rows[0].categories ? rows[0].categories.split(",") : [],
    actors: rows[0].actors ? rows[0].actors.split(",") : [],
  };
};
