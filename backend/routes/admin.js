import express from "express";
import Call from "../models/Call.js";
const router = express.Router();

// Get overall call stats & recent activity
router.get("/stats", async (req, res) => {
  try {
    const totalCalls = await Call.countDocuments();
    const acceptedCalls = await Call.countDocuments({ status: "accepted" });
    const rejectedCalls = await Call.countDocuments({ status: "rejected" });
    const pendingCalls = await Call.countDocuments({ status: "pending" });

    const recent = await Call.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name status createdAt");

    const recentActivities = recent.map((call) => ({
      action: call.status === "accepted" ? "Call Accepted" : call.status === "rejected" ? "Call Rejected" : "Call Pending",
      user: call.name || "Unknown User",
      time: call.createdAt.toLocaleString(),
      status: call.status === "accepted" ? "success" : call.status === "rejected" ? "error" : "pending",
    }));

    res.json({
      totalCalls,
      acceptedCalls,
      rejectedCalls,
      pendingCalls,
      recentActivities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;