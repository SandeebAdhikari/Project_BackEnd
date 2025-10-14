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
       a.address_id AS addressId,
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

export const searchCustomers = async (search = "") => {
  if (!search.trim()) return [];

  const [rows] = await pool.query(
    `
    SELECT 
      c.customer_id AS id,
      c.first_name AS firstName,
      c.last_name AS lastName,
      c.email
    FROM customer c
    WHERE 
      LOWER(c.first_name) LIKE LOWER(?) 
      OR LOWER(c.last_name) LIKE LOWER(?)
    ORDER BY c.first_name ASC
    LIMIT 10
    `,
    [`%${search}%`, `%${search}%`]
  );

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

// Add new customer
export const addCustomer = async ({
  firstName,
  lastName,
  email,
  address,
  city,
  country,
  active = 1,
}) => {
  try {
    const [countryRows] = await pool.query(
      `SELECT country_id FROM country WHERE country = ?`,
      [country]
    );
    let countryId =
      countryRows.length > 0
        ? countryRows[0].country_id
        : (
            await pool.query(`INSERT INTO country (country) VALUES (?)`, [
              country,
            ])
          )[0].insertId;

    const [cityRows] = await pool.query(
      `SELECT city_id FROM city WHERE city = ? AND country_id = ?`,
      [city, countryId]
    );
    let cityId =
      cityRows.length > 0
        ? cityRows[0].city_id
        : (
            await pool.query(
              `INSERT INTO city (city, country_id) VALUES (?, ?)`,
              [city, countryId]
            )
          )[0].insertId;

    const [addressResult] = await pool.query(
      `INSERT INTO address (address, address2, district, city_id, postal_code, phone, location)
       VALUES (?, '', 'Default District', ?, '00000', '000-000-0000', POINT(0,0))`,
      [address || `Default address for ${firstName} ${lastName}`, cityId]
    );

    const addressId = addressResult.insertId;

    const [customerResult] = await pool.query(
      `INSERT INTO customer (store_id, first_name, last_name, email, address_id, active, create_date)
       VALUES (1, ?, ?, ?, ?, ?, NOW())`,
      [firstName, lastName, email, addressId, active]
    );

    return { id: customerResult.insertId };
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

// Update customer
export const updateCustomer = async (
  id,
  { firstName, lastName, email, address, city, country, addressId, active }
) => {
  try {
    const [countryRows] = await pool.query(
      `SELECT country_id FROM country WHERE country = ?`,
      [country]
    );
    let countryId =
      countryRows.length > 0
        ? countryRows[0].country_id
        : (
            await pool.query(`INSERT INTO country (country) VALUES (?)`, [
              country,
            ])
          )[0].insertId;

    const [cityRows] = await pool.query(
      `SELECT city_id FROM city WHERE city = ? AND country_id = ?`,
      [city, countryId]
    );
    let cityId =
      cityRows.length > 0
        ? cityRows[0].city_id
        : (
            await pool.query(
              `INSERT INTO city (city, country_id) VALUES (?, ?)`,
              [city, countryId]
            )
          )[0].insertId;

    await pool.query(
      `UPDATE address 
       SET address = ?, city_id = ?
       WHERE address_id = ?`,
      [address, cityId, addressId]
    );

    await pool.query(
      `UPDATE customer 
       SET first_name = ?, last_name = ?, email = ?, active = ?
       WHERE customer_id = ?`,
      [firstName, lastName, email, active, id]
    );

    return { id };
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  await pool.query(`DELETE FROM rental WHERE customer_id = ?`, [id]);

  await pool.query(`DELETE FROM customer WHERE customer_id = ?`, [id]);

  return { id };
};
export const updateCustomerRentalStatus = async (id, status) => {
  try {
    await pool.query(
      `UPDATE customer SET last_update = NOW() WHERE customer_id = ?`,
      [id]
    );
  } catch (error) {
    console.error("Error updating customer rental status:", error);
    throw error;
  }
};
