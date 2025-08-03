import express from "express";
import { getToken } from "../controllers/callController.js";
import { generateVideoCallToken } from "../controllers/videoCallController.js";


const router = express.Router();

router.get("/token", getToken);  
router.post("/usertoken", generateVideoCallToken);

export default router;