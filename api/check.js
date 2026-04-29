export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "missing id" });
  }

  // MOCK (replace with real API)
  return res.json({
    status: "PENDING"
  });
}
