import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    // 1. Get token
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

    const orderId = Date.now().toString();

    // 2. Payment request
    const data = {
      service: "webpay.acquire.nativePay",
      sign_type: "MD5",
      seller_code: "CU2510-101504183252854717",
      out_trade_no: orderId,
      body: "Payment",
      total_amount: amount,
      currency: "USD",
      notify_url: "https://YOUR-VERCEL-URL/api/notify",
      service_code: "ABAAKHPP"
    };

    // 3. Sign
    const sorted = Object.keys(data)
      .sort()
      .map(k => `${k}=${data[k]}`)
      .join("&");

    data.sign = crypto
      .createHash("md5")
      .update(sorted + process.env.CLIENT_SECRET)
      .digest("hex");

    // 4. Call gateway
    const qrRes = await fetch(`${process.env.BASE_URL}/gateway`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await qrRes.json();

    result.out_trade_no = orderId;

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
