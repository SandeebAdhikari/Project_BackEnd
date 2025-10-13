import express from "express";
import {
  fetchCustomers,
  addNewCustomer,
  editCustomer,
  removeCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/all-customers", fetchCustomers);
router.post("/", addNewCustomer);
router.put("/:id", editCustomer);
router.delete("/:id", removeCustomer);

export default router;
