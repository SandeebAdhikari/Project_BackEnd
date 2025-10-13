import { getCustomers, getCustomerCount } from "../models/customerModel.js";

export const fetchCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      searchType = "name",
    } = req.query;

    const customers = await getCustomers({
      page: Number(page),
      limit: Number(limit),
      search,
      searchType,
    });
    const total = await getCustomerCount({ search, searchType });

    res.json({
      data: customers,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// Add new customer
export const addNewCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, addressId, active = 1 } = req.body;

    if (!firstName || !lastName || !email || !addressId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await addCustomer({
      firstName,
      lastName,
      email,
      addressId,
      active,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Failed to add customer" });
  }
};

// Edit customer
export const editCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, addressId, active } = req.body;

    if (!firstName || !lastName || !email || !addressId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await updateCustomer(id, {
      firstName,
      lastName,
      email,
      addressId,
      active,
    });

    res.json(result);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete customer
export const removeCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCustomer(id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
