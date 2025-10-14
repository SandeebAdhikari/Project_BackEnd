import pool from "../config/db.js";

export const getRentalFilmByIdFromDB = async (customerId) => {
  const query = `
    SELECT 
      r.rental_id,
      f.title AS film_title,
      r.rental_date,
      r.return_date,
      i.inventory_id,
      r.customer_id,
      r.staff_id,
      r.last_update
    FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    JOIN film f ON i.film_id = f.film_id
    WHERE r.customer_id = ?
    ORDER BY r.rental_date DESC;
  `;

  const [rows] = await pool.query(query, [customerId]);
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

export const addRentalRecord = async ({
  filmId,
  customerId,
  staffId,
  copies,
  rentalDuration,
}) => {
  try {
    const [inventoryRows] = await pool.query(
      `SELECT inventory_id FROM inventory WHERE film_id = ? LIMIT ?`,
      [filmId, copies]
    );

    if (inventoryRows.length === 0) {
      throw new Error("No available inventory for this film");
    }

    const rentalDate = new Date();

    for (const item of inventoryRows) {
      await pool.query(
        `INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id)
         VALUES (?, ?, ?, ?)`,
        [rentalDate, item.inventory_id, customerId, staffId]
      );
    }

    return { message: "Rental(s) created successfully" };
  } catch (err) {
    console.error("Error adding rental record:", err);
    throw err;
  }
};
