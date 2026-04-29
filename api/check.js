import axios from "axios";
import crypto from "crypto";

function sign(params, secret) {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join("&");

  return crypto.createHash("md5").update(sorted + secret).digest("hex");
}

async function getToken() {
  const res = await axios.post(process.env.TOKEN_URL, {
    grant_type: "password",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  });

  return res.data.access_token;
}

export default async function handler(req, res) {
  try {
    const token = await getToken();

    const payload = {
      service: "webpay.acquire.queryOrder",
      sign_type: "MD5",
      out_trade_no: req.query.id
    };

    payload.sign = sign(payload, process.env.SECRET_KEY);

    const response = await axios.post(
      process.env.GATEWAY_URL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.status(200).json({
      status: response.data.trade_status
    });

  } catch (err) {
    console.error("CHECK ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
}
