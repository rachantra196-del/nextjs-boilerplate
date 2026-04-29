import crypto from "crypto";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const tokenRes = await fetch(`${process.env.BASE_URL}/token`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        grant_type: "password",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: process.env.USERNAME,
        password: process.env.PASSWORD
      })
    });

    const token = (await tokenRes.json()).access_token;

    const data = {
      service: "webpay.acquire.queryOrder",
      sign_type: "MD5",
      out_trade_no: id
    };

    const sorted = Object.keys(data)
      .sort()
      .map(k => `${k}=${data[k]}`)
      .join("&");

    data.sign = crypto
      .createHash("md5")
      .update(sorted + process.env.CLIENT_SECRET)
      .digest("hex");

    const response = await fetch(`${process.env.BASE_URL}/gateway`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
