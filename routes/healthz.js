import express from "express";

const router = express.Router();

// GET /healthz - Health check
router.get("/", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

export default router;

