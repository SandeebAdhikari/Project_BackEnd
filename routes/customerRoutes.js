import express from "express";
import { fetchCustomers } from "../controllers/customerController.js";

const router = express.Router();

router.get("/all-customers", fetchCustomers);

export default router;
