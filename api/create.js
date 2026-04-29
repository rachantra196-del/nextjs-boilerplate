import axios from "axios";
import crypto from "crypto";

let TOKEN = null;

async function getToken() {
  const res = await axios.post("https://api-url/token", {
    grant_type: "password",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  });

  return res.data.access_token;
}

function sign(params, secret = process.env.SECRET_KEY) {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join("&");

  return crypto.createHash("md5").update(sorted + secret).digest("hex");
}

export default async function handler(req, res) {
  try {
    if (!TOKEN) TOKEN = await getToken();

    const orderId = Date.now().toString();

    const payload = {
      service: "webpay.acquire.nativePay",
      sign_type: "MD5",
      seller_code: process.env.SELLER_CODE,
      out_trade_no: orderId,
      body: "Testing Payment",
      total_amount: req.body.amount,
      currency: "USD",
      notify_url: "https://yourdomain.vercel.app/api/notify",
      service_code: "ABAAKHPP"
    };

    payload.sign = sign(payload);

    const response = await axios.post(
      "https://api-url/gateway",
      payload,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const data = response.data;

    res.status(200).json({
      orderId,
      qr: data.code_url || data.qr_code || data.qr
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "QR generation failed" });
  }
}
