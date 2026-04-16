const { kv } = require("@vercel/kv");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const clients = await kv.get("clients") ?? [];
  const client = clients.find(c => c.id === req.query.id);
  if (!client) return res.status(404).json({ error: "Not found" });
  res.status(200).json(client);
};
