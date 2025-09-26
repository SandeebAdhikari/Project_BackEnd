import express from "express";
import { getAllStaff, getStaffById } from "../controllers/staffController.js";

const router = express.Router();

router.get("/all-staff", getAllStaff);
router.get("/:id", getStaffById);

export default router;
