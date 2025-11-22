import express from "express";
import { connectDB } from "../lib/db.js";
import Link from "../models/Link.js";

const router = express.Router();

// GET /:code - Redirect to original URL
router.get("/:code", async (req, res) => {
  try {
    await connectDB();
    const { code } = req.params;

    // Validate code format (6-8 alphanumeric)
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return res.status(404).json({ error: "Not found" });
    }

    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ error: "Not found" });
    }

    // Update click count and last clicked time
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    // Return 302 redirect
    res.redirect(302, link.url);
  } catch (err) {
    console.error("GET /:code error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;

