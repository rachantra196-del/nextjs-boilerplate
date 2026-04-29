export default async function handler(req, res) {
  try {
    // 🔥 parse body safely
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const amount = body?.amount;

    console.log("AMOUNT RECEIVED:", amount);

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // continue your logic...
