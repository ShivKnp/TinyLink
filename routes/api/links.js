import express from "express";
import { connectDB } from "../../lib/db.js";
import Link from "../../models/Link.js";

const router = express.Router();

// Validate URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

// Validate code format: 6-8 alphanumeric characters
function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// GET /api/links - List all links
router.get("/", async (req, res) => {
  try {
    await connectDB();
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    console.error("GET /api/links error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// POST /api/links - Create a new link
router.post("/", async (req, res) => {
  try {
    await connectDB();
    const { url, code } = req.body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Generate or validate code
    let finalCode;
    if (code) {
      if (!isValidCode(code)) {
        return res.status(400).json({
          error: "Code must be 6-8 alphanumeric characters",
        });
      }
      finalCode = code;
    } else {
      // Generate random code (6 characters)
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let attempts = 0;
      do {
        finalCode = "";
        for (let i = 0; i < 6; i++) {
          finalCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        attempts++;
        if (attempts > 100) {
          return res.status(500).json({ error: "Failed to generate unique code" });
        }
      } while (await Link.findOne({ code: finalCode }));
    }

    // Check if code already exists
    const exists = await Link.findOne({ code: finalCode });
    if (exists) {
      return res.status(409).json({ error: "Code already exists" });
    }

    const link = await Link.create({ code: finalCode, url });
    res.json(link);
  } catch (err) {
    console.error("POST /api/links error:", err);
    if (err.code === 11000) {
      // MongoDB duplicate key error
      return res.status(409).json({ error: "Code already exists" });
    }
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// GET /api/links/:code - Get stats for a specific code
router.get("/:code", async (req, res) => {
  try {
    await connectDB();
    const { code } = req.params;
    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(link);
  } catch (err) {
    console.error("GET /api/links/:code error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// DELETE /api/links/:code - Delete a link
router.delete("/:code", async (req, res) => {
  try {
    await connectDB();
    const { code } = req.params;
    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ error: "Not found" });
    }

    await Link.deleteOne({ code });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/links/:code error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;

