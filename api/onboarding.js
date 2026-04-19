const GH_TOKEN = process.env.GH_TOKEN;
const GH_API   = "https://api.github.com/repos/creixelleugenio-a11y/web-agency-data/contents/db.json";

async function readDB() {
  const res = await fetch(GH_API, {
    headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const { content, sha } = await res.json();
  const raw = JSON.parse(Buffer.from(content, "base64").toString("utf8"));
  const clients     = Array.isArray(raw) ? raw : (raw.clients || []);
  const submissions = Array.isArray(raw) ? [] : (raw.submissions || []);
  return { clients, submissions, sha };
}

async function writeDB(db, sha) {
  const content = Buffer.from(JSON.stringify(db, null, 2)).toString("base64");
  const res = await fetch(GH_API, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "new onboarding submission", content, sha }),
  });
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status}`);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default async function handler(req, res) {
  // Allow cross-origin (form is public-facing)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "POST") {
      const {
        businessName, industry, phone, address, description, slogan, services, schedule,
        contactName, contactEmail, contactWhatsApp, domain,
        package: pkg,
        logoUrl, photoUrls, socials, googleBusiness, extras,
      } = req.body;
      if (!businessName || !contactName || !contactEmail) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
      }
      const submission = {
        id: uid(),
        submittedAt: new Date().toISOString().slice(0, 10),
        businessName, industry: industry || "",
        phone: phone || "", address: address || "",
        description: description || "", slogan: slogan || "",
        services: services || "", schedule: schedule || "",
        contactName, contactEmail,
        contactWhatsApp: contactWhatsApp || "",
        domain: domain || "", package: pkg || "",
        logoUrl: logoUrl || "",
        photoUrls: Array.isArray(photoUrls) ? photoUrls : [],
        socials: socials || "", googleBusiness: googleBusiness || "",
        extras: extras || "",
        reviewed: false,
      };
      const { clients, submissions, sha } = await readDB();
      await writeDB({ clients, submissions: [submission, ...submissions] }, sha);
      return res.status(201).json({ ok: true });
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
