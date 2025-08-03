import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  documentUrl: String,
  status: { type: String, default: "Pending" }
});

export default mongoose.model("KYC", kycSchema);