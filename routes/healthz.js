import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// GET /healthz - Health check
router.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ 
    ok: true, 
    version: "1.0",
    database: dbStatus
  });
});

export default router;

