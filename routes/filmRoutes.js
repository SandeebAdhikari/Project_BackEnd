import express from "express";
import { getTopFilms } from "../controllers/filmController.js";

const router = express.Router();

router.get("/top-films", getTopFilms);

export default router;
