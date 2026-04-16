const GH_TOKEN = process.env.GH_TOKEN;
const GH_API   = "https://api.github.com/repos/creixelleugenio-a11y/web-agency-data/contents/db.json";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const r = await fetch(GH_API, {
      headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: "application/vnd.github+json" },
    });
    const { content } = await r.json();
    const clients = JSON.parse(Buffer.from(content, "base64").toString("utf8"));
    const client = clients.find(c => c.id === req.query.id);
    if (!client) return res.status(404).json({ error: "Not found" });
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
