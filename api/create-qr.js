export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    let body = req.body;

    // handle string or object
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const amount = body?.amount;

    console.log("AMOUNT RECEIVED:", amount);
    console.log("FULL BODY:", body);

    if (!amount) {
      return res.status(400).json({
        error: "Amount is required",
        received: body
      });
    }

    // continue logic here...

    res.status(200).json({ ok: true, amount });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
