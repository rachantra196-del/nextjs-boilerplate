import crypto from "crypto";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const amount = body.amount;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const orderId = Date.now().toString();

    // STEP 1: TOKEN (fix endpoint if needed)
    const tokenRes = await fetch(`${process.env.BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "password",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: process.env.USERNAME,
        password: process.env.PASSWORD
      })
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    // STEP 2: PAYMENT REQUEST
    const payload = {
      service: "webpay.acquire.createorder",
      sign_type: "MD5",
      seller_code: process.env.SELLER_CODE,
      out_trade_no: orderId,
      body: "Payment",
      total_amount: amount,
      currency: "USD"
    };

    const signString = Object.keys(payload)
      .sort()
      .map(k => `${k}=${payload[k]}`)
      .join("&");

    payload.sign = crypto
      .createHash("md5")
      .update(signString + process.env.CLIENT_SECRET)
      .digest("hex");

    const payRes = await fetch(`${process.env.BASE_URL}/gateway`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await payRes.json();

    console.log("PAY RESPONSE:", result);

    // NORMALIZE QR
    const qr =
      result.qr ||
      result.qr_code ||
      result.code_url ||
      result.data?.qr ||
      result.data?.qrCode ||
      result.result?.code_url;

    return res.status(200).json({
      orderId,
      qr,
      raw: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
