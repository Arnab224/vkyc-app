// routes/videoCallRoutes.js
import express from "express";
import { generateVideoCallToken } from "../controllers/videoCallController.js";

const router = express.Router();

router.post("/usertoken", generateVideoCallToken);

export default router;