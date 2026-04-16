const { kv } = require("@vercel/kv");

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
      { id: "t2", title: "Agregar sección de noticias / blog",        status: "todo",        priority: "low",    createdAt: "2026-04-15" },
      { id: "t3", title: "Optimizar imágenes para mobile",            status: "todo",        priority: "medium", createdAt: "2026-04-15" },
      { id: "t4", title: "SEO: meta tags y Open Graph",              status: "in_progress", priority: "high",   createdAt: "2026-04-12" },
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
      { id: "l1", date: "2026-04-15", note: "Animaciones de scroll agregadas en todas las páginas." },
      { id: "l2", date: "2026-04-14", note: "Navbar con blur semi-transparente implementado." },
      { id: "l3", date: "2026-03-20", note: "Deploy inicial en Vercel completado." },
    ],
    notes: "Cliente interno (sin cobro). Stack: React + Vite + TypeScript + Tailwind. Deploy automático via Vercel.",
  },
];

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    let clients = await kv.get("clients");
    if (!clients) {
      await kv.set("clients", SEED);
      clients = SEED;
    }
    return res.status(200).json(clients);
  }

  if (req.method === "PUT") {
    const clients = req.body;
    if (!Array.isArray(clients)) {
      return res.status(400).json({ error: "Body must be an array" });
    }
    await kv.set("clients", clients);
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: "Method not allowed" });
};
