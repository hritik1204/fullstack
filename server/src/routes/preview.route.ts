import { Router } from "express";
import { getPreview } from "../controllers/preview.controller";


const router = Router();

router.post("/", getPreview);

export default router;
