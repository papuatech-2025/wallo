import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("tolikara_dp3ap2kb.db");

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS community_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nik TEXT UNIQUE NOT NULL,
    address TEXT,
    phone TEXT,
    gender TEXT,
    birth_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- PUG, PHA, GENTING, STUNTING
    description TEXT,
    date TEXT,
    location TEXT,
    status TEXT DEFAULT 'Planned'
  );

  CREATE TABLE IF NOT EXISTS violence_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    victim_name TEXT,
    reporter_name TEXT,
    incident_date TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS family_planning (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    community_id INTEGER,
    contraceptive_type TEXT,
    counseling_date TEXT,
    notes TEXT,
    FOREIGN KEY(community_id) REFERENCES community_data(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/stats", (req, res) => {
    const communityCount = db.prepare("SELECT COUNT(*) as count FROM community_data").get() as { count: number };
    const programCount = db.prepare("SELECT COUNT(*) as count FROM programs").get() as { count: number };
    const reportCount = db.prepare("SELECT COUNT(*) as count FROM violence_reports").get() as { count: number };
    res.json({ communityCount: communityCount.count, programCount: programCount.count, reportCount: reportCount.count });
  });

  // Community Data
  app.get("/api/community", (req, res) => {
    const data = db.prepare("SELECT * FROM community_data ORDER BY created_at DESC").all();
    res.json(data);
  });

  app.post("/api/community", (req, res) => {
    const { name, nik, address, phone, gender, birth_date } = req.body;
    try {
      const info = db.prepare("INSERT INTO community_data (name, nik, address, phone, gender, birth_date) VALUES (?, ?, ?, ?, ?, ?)").run(name, nik, address, phone, gender, birth_date);
      res.json({ id: info.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Programs
  app.get("/api/programs", (req, res) => {
    const data = db.prepare("SELECT * FROM programs ORDER BY date DESC").all();
    res.json(data);
  });

  app.post("/api/programs", (req, res) => {
    const { title, category, description, date, location } = req.body;
    const info = db.prepare("INSERT INTO programs (title, category, description, date, location) VALUES (?, ?, ?, ?, ?)").run(title, category, description, date, location);
    res.json({ id: info.lastInsertRowid });
  });

  // Violence Reports
  app.get("/api/reports", (req, res) => {
    const data = db.prepare("SELECT * FROM violence_reports ORDER BY created_at DESC").all();
    res.json(data);
  });

  app.post("/api/reports", (req, res) => {
    const { victim_name, reporter_name, incident_date, description } = req.body;
    const info = db.prepare("INSERT INTO violence_reports (victim_name, reporter_name, incident_date, description) VALUES (?, ?, ?, ?)").run(victim_name, reporter_name, incident_date, description);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
