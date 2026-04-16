const GH_TOKEN  = process.env.GH_TOKEN;
const GH_OWNER  = "creixelleugenio-a11y";
const GH_REPO   = "web-agency-data";
const GH_FILE   = "db.json";
const GH_API    = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`;

async function readDB() {
  const res = await fetch(GH_API, {
    headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const { content } = await res.json();
  return JSON.parse(Buffer.from(content, "base64").toString("utf8"));
}

async function writeDB(clients, sha) {
  const content = Buffer.from(JSON.stringify(clients, null, 2)).toString("base64");
  const res = await fetch(GH_API, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "update clients", content, sha }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed: ${res.status} — ${err}`);
  }
}

async function getSHA() {
  const res = await fetch(GH_API, {
    headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  const { sha } = await res.json();
  return sha;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const clients = await readDB();
      return res.status(200).json(clients);
    }

    if (req.method === "PUT") {
      const clients = req.body;
      if (!Array.isArray(clients)) return res.status(400).json({ error: "Body must be an array" });
      const sha = await getSHA();
      await writeDB(clients, sha);
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
