import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  userId: String,
  userSocketId: String,
  name: String,
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Call", callSchema);