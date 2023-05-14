import { Router } from "express";
import { vizData } from "./controller.js";

const router = Router();

router.post("/viz", vizData);

export default router;
