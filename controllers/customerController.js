import {
  getCustomers,
  getCustomerCount,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  updateCustomerRentalStatus,
} from "../models/customerModel.js";

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

export const searchCustomerByName = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const results = await searchCustomers(search);
    res.json(results);
  } catch (error) {
    console.error("Error searching customers:", error);
    res.status(500).json({ error: "Failed to search customers" });
  }
};

// Add new customer
export const addNewCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      address = "",
      city,
      country,
      active = 1,
    } = req.body;

    if (!firstName || !lastName || !email || !city || !country) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await addCustomer({
      firstName,
      lastName,
      email,
      address,
      city,
      country,
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
    const {
      firstName,
      lastName,
      email,
      address,
      city,
      country,
      addressId,
      active,
    } = req.body;

    if (!firstName || !lastName || !email || !addressId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await updateCustomer(id, {
      firstName,
      lastName,
      email,
      address,
      city,
      country,
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

export const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Missing status value" });
    }

    await updateCustomerRentalStatus(id, status);
    res.json({ message: "Customer rental status updated successfully" });
  } catch (error) {
    console.error("Error updating rental status:", error);
    res.status(500).json({ error: "Failed to update customer rental status" });
  }
};
