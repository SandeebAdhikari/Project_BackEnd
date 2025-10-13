import pool from "../config/db.js";

export const getRentalFilmByIdFromDB = async (id) => {
  const query = `
    SELECT r.rental_id,
           r.rental_date,
           i.inventory_id,
           r.customer_id,
           r.return_date,
           r.staff_id,
           r.last_update
    FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    JOIN film f ON i.film_id = f.film_id
    WHERE r.return_date IS NULL AND r.customer_id = ?
    ORDER BY r.rental_date;
  `;
  const [rows] = await pool.query(query, [id]);
  return rows;
};

export const getRentalsByFilmDB = async (filmId) => {
  const [rows] = await pool.query(
    `SELECT r.rental_id, r.rental_date, r.return_date, r.customer_id, r.staff_id, r.last_update
     FROM rental r
     JOIN inventory i ON r.inventory_id = i.inventory_id
     WHERE i.film_id = ?`,
    [filmId]
  );
  return rows;
};

export const markRentalAsReturned = async (rentalId) => {
  const [result] = await pool.query(
    `UPDATE rental
     SET return_date = NOW()
     WHERE rental_id = ? AND return_date IS NULL`,
    [rentalId]
  );
  return result.affectedRows > 0;
};
