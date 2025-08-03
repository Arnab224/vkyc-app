import { Server } from "socket.io";
import Call from "./models/Call.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Join room for VKYC calls
    socket.on("join-room", (roomName) => {
      socket.join(roomName);
      console.log(`🔵 Socket ${socket.id} joined room: ${roomName}`);
    });

    // VKYC Request from user to admin
    socket.on("vkyc_request", async (data) => {
      console.log(`📢 VKYC request from ${socket.id}:`, data);

      // Save to DB
      const newCall = new Call({
        userId: data.userId || "unknown",
        userSocketId: socket.id,
        name: data.name || "User",
        status: "pending",
      });
      await newCall.save();

      // Notify all admins
      io.emit("vkyc_notification", {
        userSocketId: socket.id,
        name: data.name,
        userId: data.userId || "unknown",
      });
    });

    // VKYC Accepted by admin
    socket.on("vkyc_accept", async (data) => {
      console.log(`✔️ VKYC accepted by admin for user: ${data.userSocketId}`);

      // Update DB
      await Call.findOneAndUpdate(
        { userSocketId: data.userSocketId },
        { status: "accepted" }
      );

      io.to(data.userSocketId).emit("vkyc_accepted");
    });

    // Admin ends the VKYC call for the room
    socket.on("end-call", async ({ roomName, callData }) => {
      console.log(`❌ VKYC call ended in room: ${roomName}`);

      await Call.findOneAndUpdate(
        { userSocketId: callData.userSocketId },
        { status: "rejected" }
      );

      io.to(roomName).emit("call-ended", callData);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIo = () => io;