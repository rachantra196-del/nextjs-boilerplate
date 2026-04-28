import crypto from "crypto";

function generateSign(params) {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join("&");

  return crypto.createHash("md5").update(sorted).digest("hex");
}

export default async function handler(req, res) {
  try {
    // 1. Get token
    const tokenRes = await fetch("https://devwebpayment.kesspay.io/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        grant_type: "password",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: process.env.USERNAME,
        password: process.env.PASSWORD
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.status(500).json(tokenData);
    }

    // 2. Create order
    const payload = {
      service: "webpay.acquire.createorder",
      sign_type: "MD5",
      seller_code: process.env.SELLER_CODE,
      out_trade_no: Math.random().toString(36).substring(2, 12),
      body: "Testing Payment",
      total_amount: 10,
      currency: "USD",
      login_type: "ANONYMOUS",
      expires_in: 6000
    };

    payload.sign = generateSign(payload);

    const orderRes = await fetch("https://devwebpayment.kesspay.io/api", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const orderData = await orderRes.json();

    res.status(200).json(orderData);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
