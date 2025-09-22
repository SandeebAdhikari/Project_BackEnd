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
