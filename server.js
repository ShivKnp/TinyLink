import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import linksRouter from "./routes/api/links.js";
import redirectRouter from "./routes/redirect.js";
import healthRouter from "./routes/healthz.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/links", linksRouter);
app.use("/healthz", healthRouter);

// Serve frontend pages (before redirect route)
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

app.get("/code/:code", (req, res) => {
  res.sendFile(join(__dirname, "public", "stats.html"));
});

// Redirect route (must be last to catch /:code)
app.use("/", redirectRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

