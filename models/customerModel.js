import pool from "../config/db.js";

export const getCustomers = async ({
  page = 1,
  limit = 10,
  search = "",
  searchType = "name",
}) => {
  const offset = (page - 1) * limit;

  let baseQuery = `
    SELECT c.customer_id AS id,
           c.first_name AS firstName,
           c.last_name AS lastName,
           c.email,
           a.address,
           ci.city,
           co.country,
           a.phone,
           c.active,
           c.create_date AS createDate,
           (
              SELECT COUNT(*)
              FROM rental r
              WHERE r.customer_id = c.customer_id
                AND r.return_date IS NULL
           ) AS activeRentals,
           (
              SELECT COUNT(*)
              FROM rental r
              WHERE r.customer_id = c.customer_id
           ) AS totalRentals
    FROM customer c
    JOIN address a ON c.address_id = a.address_id
    JOIN city ci ON a.city_id = ci.city_id
    JOIN country co ON ci.country_id = co.country_id
    WHERE 1 = 1
  `;

  if (search) {
    if (searchType === "name") {
      baseQuery += ` AND (c.first_name LIKE ? OR c.last_name LIKE ?) `;
    } else if (searchType === "id") {
      baseQuery += ` AND c.customer_id = ? `;
    }
  }

  baseQuery += ` ORDER BY c.customer_id LIMIT ? OFFSET ?`;

  let params;
  if (search && searchType === "name") {
    params = [`%${search}%`, `%${search}%`, limit, offset];
  } else if (search && searchType === "id") {
    params = [search, limit, offset];
  } else {
    params = [limit, offset];
  }

  const [rows] = await pool.query(baseQuery, params);
  return rows;
};

export const getCustomerCount = async ({
  search = "",
  searchType = "name",
}) => {
  let countQuery = `SELECT COUNT(*) as total FROM customer c WHERE 1=1`;
  let params = [];

  if (search) {
    if (searchType === "name") {
      countQuery += ` AND (c.first_name LIKE ? OR c.last_name LIKE ?) `;
      params = [`%${search}%`, `%${search}%`];
    } else if (searchType === "id") {
      countQuery += ` AND c.customer_id = ? `;
      params = [search];
    }
  }

  const [rows] = await pool.query(countQuery, params);
  return rows[0].total;
};

export const searchCustomersFromDB = async (query) => {
  const [rows] = await pool.query(
    `
    SELECT 
      customer_id AS id,
      first_name AS firstName,
      last_name AS lastName,
      email
    FROM customer
    WHERE first_name LIKE ? OR last_name LIKE ?
    ORDER BY last_name ASC
    LIMIT 20
    `,
    [`%${query}%`, `%${query}%`]
  );
  return rows;
};

// Add new customer
export const addCustomer = async ({
  firstName,
  lastName,
  email,
  addressId,
  active = 1,
}) => {
  const [result] = await pool.query(
    `INSERT INTO customer (store_id, first_name, last_name, email, address_id, active, create_date)
     VALUES (1, ?, ?, ?, ?, ?, NOW())`,
    [firstName, lastName, email, addressId, active]
  );
  return { id: result.insertId };
};

// Update customer
export const updateCustomer = async (
  id,
  { firstName, lastName, email, addressId, active }
) => {
  await pool.query(
    `UPDATE customer 
     SET first_name = ?, last_name = ?, email = ?, address_id = ?, active = ?
     WHERE customer_id = ?`,
    [firstName, lastName, email, addressId, active, id]
  );
  return { id };
};

// Delete customer
export const deleteCustomer = async (id) => {
  await pool.query(`DELETE FROM customer WHERE customer_id = ?`, [id]);
  return { id };
};
