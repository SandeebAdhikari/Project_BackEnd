import express from "express";
import {
  fetchCustomers,
  addNewCustomer,
  editCustomer,
  removeCustomer,
  searchCustomerByName,
  updateRentalStatus,
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/all-customers", fetchCustomers);
router.post("/", addNewCustomer);
router.put("/:id", editCustomer);
router.delete("/:id", removeCustomer);
router.get("/search", searchCustomerByName);

router.put("/:id/rental-status", updateRentalStatus);

export default router;
