import KYC from "../models/KYC.js";

export const uploadDocument = async (req, res) => {
  const fileUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;
  const kyc = await KYC.create({ userId: req.user.id, documentUrl: fileUrl });
  res.json(kyc);
};