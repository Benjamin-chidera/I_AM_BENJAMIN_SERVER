import { Router } from "express";
import { getSocial } from "../controller/social.ts";

const router = Router();

router.get("/social", getSocial);
export default router;
