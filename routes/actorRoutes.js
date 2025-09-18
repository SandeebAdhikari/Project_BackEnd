import express from "express";
import { getTopActor } from "../controllers/actorController.js";

const router = express.Router();

router.get("/top-actors", getTopActor);

export default router;
