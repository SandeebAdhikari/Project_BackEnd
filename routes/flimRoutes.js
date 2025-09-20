import express from "express";
import { getAllFilmsWithActors } from "../controllers/filmController.js";

const router = express.Router();

router.get("/all-films", getAllFilmsWithActors);

export default router;
