import pool from "../config/db.js";

// get all staff
export async function getAllStaffFromDB() {
  const [rows] = await pool.query(
    `SELECT s.staff_id, s.first_name, s.last_name, a.address, s.email, 
            s.store_id, s.active, s.username, s.last_update
     FROM staff s
     JOIN address a ON s.address_id = a.address_id`
  );
  return rows;
}

// get staff by ID
export async function getStaffByIdFromDB(id) {
  const [rows] = await pool.query(
    `SELECT s.staff_id, s.first_name, s.last_name, a.address, s.email, 
            s.store_id, s.active, s.username, s.last_update
     FROM staff s
     JOIN address a ON s.address_id = a.address_id
     WHERE s.staff_id = ?`,
    [id]
  );
  return rows[0];
}
