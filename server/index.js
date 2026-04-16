const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, "db.json");
const DB_TMP  = DB_PATH + ".tmp";

app.use(express.json());

// ── Seed data (used only if db.json does not exist) ─────────────────────────
const SEED = [
  {
    id: "cretum",
    name: "Cretum Partners",
    industry: "Asset Management",
    contactName: "Eugenio Creixell",
    contactEmail: "ecreixell@cretumpartners.com",
    contactWhatsApp: "",
    status: "active",
    package: "custom",
    monthlyFee: 0,
    startDate: "2026-01-01",
    domain: "cretumpartners.com",
    links: {
      github:  "https://github.com/ANGEL-0G/Cretum-Website",
      vercel:  "https://vercel.com/angel-0gs-projects/cretum-website",
      website: "https://cretum-website.vercel.app",
    },
    tasks: [
      { id: "t1", title: "Revisar animaciones en todas las páginas", status: "done",        priority: "medium", createdAt: "2026-04-10", completedAt: "2026-04-15" },
      { id: "t2", title: "Agregar sección de noticias / blog",         status: "todo",        priority: "low",    createdAt: "2026-04-15" },
      { id: "t3", title: "Optimizar imágenes para mobile",             status: "todo",        priority: "medium", createdAt: "2026-04-15" },
      { id: "t4", title: "SEO: meta tags y Open Graph",               status: "in_progress", priority: "high",   createdAt: "2026-04-12" },
    ],
    monthlyChecks: [
      { id: "c1", label: "Deploy en producción actualizado",     done: true  },
      { id: "c2", label: "Sin errores en consola (Vercel logs)", done: true  },
      { id: "c3", label: "Formulario de contacto funciona",      done: true  },
      { id: "c4", label: "Links del navbar correctos",           done: true  },
      { id: "c5", label: "Versión móvil revisada",               done: false },
      { id: "c6", label: "Backup del repo en GitHub",            done: true  },
    ],
    logs: [
      { id: "l1", date: "2026-04-15", note: "Animaciones de scroll agregadas en todas las páginas principales y sub-páginas." },
      { id: "l2", date: "2026-04-14", note: "Navbar con blur semi-transparente implementado." },
      { id: "l3", date: "2026-03-20", note: "Deploy inicial en Vercel completado." },
    ],
    notes: "Cliente interno (sin cobro). Primer proyecto de referencia. Stack: React + Vite + TypeScript + Tailwind. Deploy automático via Vercel en push a main.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    writeDB(SEED);
    return SEED;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDB(clients) {
  const data = JSON.stringify(clients, null, 2);
  fs.writeFileSync(DB_TMP, data, "utf8");
  fs.renameSync(DB_TMP, DB_PATH); // atomic on same filesystem
}

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/clients — return all clients
app.get("/api/clients", (req, res) => {
  try {
    res.json(readDB());
  } catch (err) {
    res.status(500).json({ error: "Could not read database" });
  }
});

// PUT /api/clients — replace the entire client array
app.put("/api/clients", (req, res) => {
  try {
    const clients = req.body;
    if (!Array.isArray(clients)) return res.status(400).json({ error: "Body must be an array" });
    writeDB(clients);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Could not write database" });
  }
});

// GET /api/clients/:id — single client
app.get("/api/clients/:id", (req, res) => {
  const clients = readDB();
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Not found" });
  res.json(client);
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  // Ensure db.json exists on startup
  readDB();
  console.log(`[API] Agency server running on http://localhost:${PORT}`);
  console.log(`[API] Database: ${DB_PATH}`);
});
