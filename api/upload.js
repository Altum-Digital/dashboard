const GH_TOKEN = process.env.GH_TOKEN;
const REPO = "creixelleugenio-a11y/web-agency-data";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { filename, base64 } = req.body;
    if (!filename || !base64) return res.status(400).json({ error: "Missing fields" });

    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `assets/${Date.now()}_${safe}`;

    const ghRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: `upload ${safe}`, content: base64 }),
    });

    if (!ghRes.ok) {
      const err = await ghRes.json();
      return res.status(500).json({ error: err.message || "GitHub upload failed" });
    }

    const data = await ghRes.json();
    return res.status(200).json({ url: data.content.download_url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
