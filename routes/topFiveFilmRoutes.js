import express from "express";
import { getTopFiveFilms } from "../controllers/topFiveFlimController.js";

const router = express.Router();

router.get("/top-films", getTopFiveFilms);

export default router;
