import express from "express";
import {
  fetchCustomers,
  searchCustomers,
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/all-customers", fetchCustomers);
router.get("/search", searchCustomers);

export default router;
